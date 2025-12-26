'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Simplex Noise GLSL
const noiseGLSL = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`

// Poisson Disk Sampling
function poissonDiskSampling(width: number, height: number, minDist: number, maxDist: number): [number, number][] {
  const cellSize = minDist / Math.SQRT2
  const gridW = Math.ceil(width / cellSize)
  const gridH = Math.ceil(height / cellSize)
  const grid: ([number, number] | null)[] = new Array(gridW * gridH).fill(null)
  const points: [number, number][] = []
  const active: [number, number][] = []
  
  const gridIdx = (x: number, y: number) => Math.floor(y / cellSize) * gridW + Math.floor(x / cellSize)
  const isValid = (x: number, y: number): boolean => {
    if (x < 0 || x >= width || y < 0 || y >= height) return false
    const gx = Math.floor(x / cellSize), gy = Math.floor(y / cellSize)
    for (let i = Math.max(0, gy - 2); i <= Math.min(gridH - 1, gy + 2); i++) {
      for (let j = Math.max(0, gx - 2); j <= Math.min(gridW - 1, gx + 2); j++) {
        const n = grid[i * gridW + j]
        if (n && (n[0] - x) ** 2 + (n[1] - y) ** 2 < minDist * minDist) return false
      }
    }
    return true
  }
  const addPoint = (x: number, y: number) => {
    const p: [number, number] = [x, y]
    points.push(p); active.push(p); grid[gridIdx(x, y)] = p
  }
  
  addPoint(width / 2, height / 2)
  while (active.length > 0) {
    const idx = Math.floor(Math.random() * active.length)
    const pt = active[idx]
    let found = false
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2
      const r = minDist + Math.random() * (maxDist - minDist)
      const nx = pt[0] + Math.cos(angle) * r
      const ny = pt[1] + Math.sin(angle) * r
      if (isValid(nx, ny)) { addPoint(nx, ny); found = true; break }
    }
    if (!found) active.splice(idx, 1)
  }
  return points
}

const mapRange = (v: number, a: number, b: number, c: number, d: number) => (v - a) * (d - c) / (b - a) + c

async function loadImageData(src: string): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 500
      canvas.height = 500
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, 500, 500)
      resolve(ctx.getImageData(0, 0, 500, 500))
    }
    img.onerror = reject
    img.src = src
  })
}

function distanceFunction(point: [number, number], imageData: ImageData): number {
  const x = Math.round(point[0])
  const y = Math.round(point[1])
  if (x < 0 || x >= 500 || y < 0 || y >= 500) return 1
  const pixelRedIndex = (x + y * imageData.width) * 4
  const pixel = imageData.data[pixelRedIndex] / 255
  return pixel * pixel * pixel
}

function findNearestShapePoints(basePoints: [number, number][], imageData: ImageData): [number, number][] {
  const shapePoints: [number, number][] = []
  const step = 2
  for (let y = 0; y < 500; y += step) {
    for (let x = 0; x < 500; x += step) {
      const dist = distanceFunction([x, y], imageData)
      if (dist < 0.5) shapePoints.push([x, y])
    }
  }
  
  const nearestPoints: [number, number][] = []
  for (const bp of basePoints) {
    let nearestPoint: [number, number] = [bp[0], bp[1]]
    let nearestDistance = Infinity
    for (const sp of shapePoints) {
      if (Math.random() < 0.75) continue
      const distance = Math.sqrt((sp[0] - bp[0]) ** 2 + (sp[1] - bp[1]) ** 2)
      const pixelRedValue = distanceFunction(sp, imageData)
      if (pixelRedValue < 1 && distance < nearestDistance) {
        nearestDistance = distance
        nearestPoint = sp
      }
    }
    nearestPoints.push(nearestPoint)
  }
  return nearestPoints
}

class MorphingParticles {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  simScene: THREE.Scene
  simCamera: THREE.OrthographicCamera
  simMaterial!: THREE.ShaderMaterial
  renderMaterial!: THREE.ShaderMaterial
  mesh!: THREE.Points
  rt1!: THREE.WebGLRenderTarget
  rt2!: THREE.WebGLRenderTarget
  posTex!: THREE.DataTexture
  posNearestTex!: THREE.DataTexture
  clock: THREE.Clock
  
  size = 256
  count = 0
  density = 130
  particlesScale = 0.5
  cameraZoom = 7.5
  colorScheme = 1
  color1 = '#aecbfa'
  color2 = '#aecbfa'
  color3 = '#93bbfc'
  
  width: number
  height: number
  pixelRatio: number
  time = 0
  lastTime = 0
  hoverProgress = 0
  pulseProgress = 0
  mouseIsOver = false
  everRendered = false

  constructor(canvas: HTMLCanvasElement, texturePath: string) {
    const rect = canvas.getBoundingClientRect()
    this.width = rect.width || 600
    this.height = rect.height || 600
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)
    
    canvas.width = this.width * this.pixelRatio
    canvas.height = this.height * this.pixelRatio

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
    this.renderer.setSize(this.width, this.height)
    this.renderer.setPixelRatio(this.pixelRatio)

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xffffff)
    
    this.camera = new THREE.PerspectiveCamera(40, this.width / this.height, 0.1, 1000)
    this.camera.position.z = this.cameraZoom

    this.simScene = new THREE.Scene()
    this.simCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    this.clock = new THREE.Clock()

    this.initAsync(texturePath)
  }

  async initAsync(texturePath: string) {
    const imageData = await loadImageData(texturePath)
    const minDist = mapRange(this.density, 0, 300, 10, 2)
    const maxDist = mapRange(this.density, 0, 300, 11, 3)
    const basePoints = poissonDiskSampling(500, 500, minDist, maxDist)
    this.count = basePoints.length
    const nearestPoints = findNearestShapePoints(basePoints, imageData)
    
    const length = this.size * this.size
    const posData = new Float32Array(length * 4)
    const nearestData = new Float32Array(length * 4)
    
    for (let i = 0; i < this.count; i++) {
      const bp = basePoints[i], np = nearestPoints[i]
      const bx = (bp[0] - 250) / 250, by = (bp[1] - 250) / 250
      const nx = (np[0] - 250) / 250, ny = (np[1] - 250) / 250
      const idx = i * 4
      posData[idx] = bx; posData[idx + 1] = by; posData[idx + 2] = 0; posData[idx + 3] = 0
      nearestData[idx] = nx; nearestData[idx + 1] = ny; nearestData[idx + 2] = 0; nearestData[idx + 3] = 0
    }
    
    this.posTex = new THREE.DataTexture(posData, this.size, this.size, THREE.RGBAFormat, THREE.FloatType)
    this.posTex.needsUpdate = true
    this.posNearestTex = new THREE.DataTexture(nearestData, this.size, this.size, THREE.RGBAFormat, THREE.FloatType)
    this.posNearestTex.needsUpdate = true
    
    const rtOpts = { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat, type: THREE.FloatType, depthBuffer: false }
    this.rt1 = new THREE.WebGLRenderTarget(this.size, this.size, rtOpts)
    this.rt2 = new THREE.WebGLRenderTarget(this.size, this.size, rtOpts)
    
    this.renderer.setRenderTarget(this.rt1); this.renderer.setClearColor(0x000000, 0); this.renderer.clear()
    this.renderer.setRenderTarget(this.rt2); this.renderer.clear(); this.renderer.setRenderTarget(null)

    this.createSimMaterial()
    this.createRenderMaterial()
    this.createMesh()
  }

  createSimMaterial() {
    this.simMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPosition: { value: this.posTex }, uPosRefs: { value: this.posTex }, uPosNearest: { value: this.posNearestTex },
        uTime: { value: 0 }, uDeltaTime: { value: 0 }, uIsHovering: { value: 0 },
      },
      vertexShader: `void main() { gl_Position = vec4(position, 1.0); }`,
      fragmentShader: `
        precision highp float;
        uniform sampler2D uPosition, uPosRefs, uPosNearest;
        uniform float uTime, uDeltaTime, uIsHovering;
        vec2 hash(vec2 p) { p = vec2(dot(p, vec2(2127.1, 81.17)), dot(p, vec2(1269.5, 283.37))); return fract(sin(p) * 43758.5453); }
        void main() {
          vec2 uv = gl_FragCoord.xy / ${this.size.toFixed(1)};
          vec4 pFrame = texture2D(uPosition, uv);
          float scale = pFrame.z, velocity = pFrame.w;
          vec2 refPos = texture2D(uPosRefs, uv).xy, nearestPos = texture2D(uPosNearest, uv).xy;
          float seed = hash(uv).x, seed2 = hash(uv).y;
          float time = uTime * 0.5, lifeEnd = 3.0 + sin(seed2 * 100.0) * 1.0;
          float lifeTime = mod((seed * 100.0) + time, lifeEnd);
          vec2 pos = pFrame.xy;
          float distRadius = 0.15;
          vec2 targetPos = mix(refPos, nearestPos, uIsHovering * uIsHovering);
          vec2 direction = normalize(targetPos - pos) * 0.01;
          float dist = length(targetPos - pos), distStrength = smoothstep(distRadius, 0.0, dist);
          if (dist > 0.005) pos += direction * distStrength;
          if (lifeTime < 0.01) { pos = refPos; pFrame.xy = refPos; scale = 0.0; }
          float targetScale = smoothstep(0.01, 0.5, lifeTime) - smoothstep(0.5, 1.0, lifeTime / lifeEnd);
          targetScale += smoothstep(0.1, 0.0, smoothstep(0.001, 0.1, dist)) * 1.5 * uIsHovering;
          scale += (targetScale - scale) * 0.1;
          vec2 diff = (pos - pFrame.xy) * 0.2;
          velocity = smoothstep(distRadius, 0.001, dist) * uIsHovering;
          gl_FragColor = vec4(pFrame.xy + diff, scale, velocity);
        }
      `,
    })
    this.simScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.simMaterial))
  }

  createRenderMaterial() {
    const particleScale = this.width / this.pixelRatio / 2000 * this.particlesScale
    this.renderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPosition: { value: this.posTex }, uTime: { value: 0 },
        uColor1: { value: new THREE.Color(this.color1) }, uColor2: { value: new THREE.Color(this.color2) }, uColor3: { value: new THREE.Color(this.color3) },
        uAlpha: { value: 1 }, uIsHovering: { value: 0 }, uPulseProgress: { value: 0 },
        uParticleScale: { value: particleScale }, uPixelRatio: { value: this.pixelRatio }, uColorScheme: { value: this.colorScheme },
      },
      vertexShader: `
        precision highp float;
        attribute vec4 seeds;
        uniform sampler2D uPosition;
        uniform float uTime, uParticleScale, uPixelRatio, uIsHovering, uPulseProgress;
        uniform int uColorScheme;
        varying float vVelocity, vScale;
        ${noiseGLSL}
        void main() {
          vec4 pos = texture2D(uPosition, uv);
          float noiseX = snoise(vec3(pos.xy * 10.0, uTime * 0.2 + 100.0)), noiseY = snoise(vec3(pos.xy * 10.0, uTime * 0.2));
          float noiseX2 = snoise(vec3(pos.xy * 0.5, uTime * 0.15 + 45.0)), noiseY2 = snoise(vec3(pos.xy * 0.5, uTime * 0.15 + 87.0));
          float cDist = length(pos.xy), progress = uPulseProgress;
          float t = smoothstep(progress - 0.25, progress, cDist) - smoothstep(progress, progress + 0.25, cDist);
          t *= smoothstep(1.0, 0.0, cDist);
          pos.xy *= 1.0 + (t * 0.02);
          float dist = mix(0.0, smoothstep(0.0, 0.9, pos.w), uIsHovering);
          pos.y += noiseY * 0.005 * dist + noiseY2 * 0.02;
          pos.x += noiseX * 0.005 * dist + noiseX2 * 0.02;
          vVelocity = pos.w; vScale = pos.z;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos.xy, 0.0, 1.0);
          float minScale = 0.25 + float(uColorScheme) * 0.75;
          gl_PointSize = ((vScale * 7.0) * (uPixelRatio * 0.5) * uParticleScale) + (minScale * uPixelRatio);
        }
      `,
      fragmentShader: `
        precision highp float;
        varying float vScale, vVelocity;
        uniform vec3 uColor1, uColor2, uColor3;
        uniform float uAlpha;
        uniform int uColorScheme;
        void main() {
          vec2 uv = gl_PointCoord.xy - 0.5; uv.y *= -1.0;
          float h = 0.8, progress = vVelocity;
          vec3 col = mix(mix(uColor1, uColor2, progress / h), mix(uColor2, uColor3, (progress - h) / (1.0 - h)), step(h, progress));
          float disc = smoothstep(0.5, 0.45, length(uv));
          float a = uAlpha * disc * smoothstep(0.1, 0.2, vScale);
          if (a < 0.01) discard;
          col = mix(col, col * clamp(vVelocity, 0.0, 1.0), float(uColorScheme));
          gl_FragColor = vec4(clamp(col, 0.0, 1.0), clamp(a, 0.0, 1.0));
        }
      `,
      transparent: true, depthTest: false, depthWrite: false,
    })
  }

  createMesh() {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(this.count * 3)
    const uvs = new Float32Array(this.count * 2)
    const seeds = new Float32Array(this.count * 4)
    for (let i = 0; i < this.count; i++) {
      uvs[i * 2] = (i % this.size) / this.size
      uvs[i * 2 + 1] = Math.floor(i / this.size) / this.size
      seeds[i * 4] = Math.random(); seeds[i * 4 + 1] = Math.random(); seeds[i * 4 + 2] = Math.random(); seeds[i * 4 + 3] = Math.random()
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
    geometry.setAttribute('seeds', new THREE.BufferAttribute(seeds, 4))
    this.mesh = new THREE.Points(geometry, this.renderMaterial)
    this.mesh.scale.set(5, -5, 5)
    this.scene.add(this.mesh)
  }

  onHoverStart() { this.mouseIsOver = true }
  onHoverEnd() { this.mouseIsOver = false }

  update() {
    if (!this.mesh || !this.simMaterial || !this.renderMaterial) return
    const dt = this.clock.getDelta()
    this.time += dt
    this.lastTime = this.clock.getElapsedTime()
    this.hoverProgress += ((this.mouseIsOver ? 1 : 0) - this.hoverProgress) * 0.05
    if (this.mouseIsOver) { this.pulseProgress += dt * 0.5; if (this.pulseProgress > 1.5) this.pulseProgress = 0 }
    const particleScale = this.width / this.pixelRatio / 2000 * this.particlesScale

    this.simMaterial.uniforms.uPosition.value = this.everRendered ? this.rt1.texture : this.posTex
    this.simMaterial.uniforms.uTime.value = this.lastTime
    this.simMaterial.uniforms.uIsHovering.value = this.hoverProgress
    this.renderer.setRenderTarget(this.rt2); this.renderer.render(this.simScene, this.simCamera); this.renderer.setRenderTarget(null)

    this.renderMaterial.uniforms.uPosition.value = this.everRendered ? this.rt2.texture : this.posTex
    this.renderMaterial.uniforms.uTime.value = this.lastTime
    this.renderMaterial.uniforms.uParticleScale.value = particleScale
    this.renderMaterial.uniforms.uIsHovering.value = this.hoverProgress
    this.renderMaterial.uniforms.uPulseProgress.value = this.pulseProgress
    this.renderer.render(this.scene, this.camera)

    const tmp = this.rt1; this.rt1 = this.rt2; this.rt2 = tmp
    this.everRendered = true
  }

  dispose() {
    this.mesh?.geometry.dispose(); this.simMaterial?.dispose(); this.renderMaterial?.dispose()
    this.rt1?.dispose(); this.rt2?.dispose(); this.posTex?.dispose(); this.posNearestTex?.dispose()
    this.renderer.dispose()
  }
}

export default function AntigravityDemo() {
  const leftRef = useRef<HTMLCanvasElement>(null)
  const rightRef = useRef<HTMLCanvasElement>(null)
  const leftParticles = useRef<MorphingParticles | null>(null)
  const rightParticles = useRef<MorphingParticles | null>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!leftRef.current || !rightRef.current) return
    const timer = setTimeout(() => {
      if (!leftRef.current || !rightRef.current) return
      leftParticles.current = new MorphingParticles(leftRef.current, '/textures/icons/individual.png')
      rightParticles.current = new MorphingParticles(rightRef.current, '/textures/icons/cube.png')
      const animate = () => { leftParticles.current?.update(); rightParticles.current?.update(); rafRef.current = requestAnimationFrame(animate) }
      animate()
    }, 100)
    return () => { clearTimeout(timer); cancelAnimationFrame(rafRef.current); leftParticles.current?.dispose(); rightParticles.current?.dispose() }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
        <div className="relative aspect-square md:aspect-auto md:h-screen">
          <canvas ref={leftRef} className="absolute inset-0 w-full h-full" onMouseEnter={() => leftParticles.current?.onHoverStart()} onMouseLeave={() => leftParticles.current?.onHoverEnd()} />
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-8 pointer-events-none">
            <span className="text-[11px] text-[#5f6368] mb-3 tracking-wide bg-white/90 backdrop-blur-sm border border-[#dadce0] px-3 py-1.5 rounded-full">Available at no charge</span>
            <h2 className="text-[32px] md:text-[40px] font-normal text-[#202124] leading-tight">For developers</h2>
            <p className="text-[32px] md:text-[40px] font-normal text-[#9aa0a6] leading-tight mb-8">Achieve new heights</p>
            <button className="bg-[#202124] text-white px-8 py-3 rounded-full text-[15px] font-medium pointer-events-auto hover:bg-[#3c4043] transition-colors">Download</button>
          </div>
        </div>
        <div className="relative aspect-square md:aspect-auto md:h-screen">
          <canvas ref={rightRef} className="absolute inset-0 w-full h-full" onMouseEnter={() => rightParticles.current?.onHoverStart()} onMouseLeave={() => rightParticles.current?.onHoverEnd()} />
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-8 pointer-events-none">
            <span className="text-[11px] text-[#5f6368] mb-3 tracking-wide bg-white/90 backdrop-blur-sm border border-[#dadce0] px-3 py-1.5 rounded-full">Coming soon</span>
            <h2 className="text-[32px] md:text-[40px] font-normal text-[#202124] leading-tight">For organizations</h2>
            <p className="text-[32px] md:text-[40px] font-normal text-[#9aa0a6] leading-tight mb-8">Level up your entire team</p>
            <button className="bg-white text-[#202124] px-8 py-3 rounded-full text-[15px] font-medium border border-[#dadce0] pointer-events-auto hover:bg-[#f8f9fa] transition-colors">Notify me</button>
          </div>
        </div>
      </div>
    </div>
  )
}
