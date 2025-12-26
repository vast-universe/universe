'use client'

import { useEffect, useRef, useCallback } from 'react'
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

function poissonDiskSampling(width: number, height: number, minDist: number, maxDist: number): [number, number][] {
  const cellSize = minDist / Math.SQRT2
  const gridW = Math.ceil(width / cellSize), gridH = Math.ceil(height / cellSize)
  const grid: ([number, number] | null)[] = new Array(gridW * gridH).fill(null)
  const points: [number, number][] = [], active: [number, number][] = []
  const gridIdx = (x: number, y: number) => Math.floor(y / cellSize) * gridW + Math.floor(x / cellSize)
  const isValid = (x: number, y: number): boolean => {
    if (x < 0 || x >= width || y < 0 || y >= height) return false
    const gx = Math.floor(x / cellSize), gy = Math.floor(y / cellSize)
    for (let i = Math.max(0, gy - 2); i <= Math.min(gridH - 1, gy + 2); i++)
      for (let j = Math.max(0, gx - 2); j <= Math.min(gridW - 1, gx + 2); j++) {
        const n = grid[i * gridW + j]
        if (n && (n[0] - x) ** 2 + (n[1] - y) ** 2 < minDist * minDist) return false
      }
    return true
  }
  const addPoint = (x: number, y: number) => { const p: [number, number] = [x, y]; points.push(p); active.push(p); grid[gridIdx(x, y)] = p }
  addPoint(width / 2, height / 2)
  while (active.length > 0) {
    const idx = Math.floor(Math.random() * active.length), pt = active[idx]
    let found = false
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2, r = minDist + Math.random() * (maxDist - minDist)
      const nx = pt[0] + Math.cos(angle) * r, ny = pt[1] + Math.sin(angle) * r
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
      canvas.width = 500; canvas.height = 500
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, 500, 500)
      resolve(ctx.getImageData(0, 0, 500, 500))
    }
    img.onerror = reject
    img.src = src
  })
}

function distanceFunction(point: [number, number], imageData: ImageData): number {
  const x = Math.round(point[0]), y = Math.round(point[1])
  if (x < 0 || x >= 500 || y < 0 || y >= 500) return 1
  const pixel = imageData.data[(x + y * imageData.width) * 4] / 255
  return pixel * pixel * pixel
}

function findNearestShapePoints(basePoints: [number, number][], imageData: ImageData): [number, number][] {
  const shapePoints: [number, number][] = []
  for (let y = 0; y < 500; y += 2) for (let x = 0; x < 500; x += 2) if (distanceFunction([x, y], imageData) < 0.5) shapePoints.push([x, y])
  return basePoints.map(bp => {
    let nearest: [number, number] = bp, minD = Infinity
    for (const sp of shapePoints) {
      if (Math.random() < 0.75) continue
      const d = Math.sqrt((sp[0] - bp[0]) ** 2 + (sp[1] - bp[1]) ** 2)
      if (distanceFunction(sp, imageData) < 1 && d < minD) { minD = d; nearest = sp }
    }
    return nearest
  })
}

export interface MorphingParticlesProps {
  texturePath: string
  className?: string
  density?: number
  particlesScale?: number
  cameraZoom?: number
  colors?: [string, string, string]
  darkColors?: [string, string, string]
  transparent?: boolean
}

class ParticleEngine {
  renderer: THREE.WebGLRenderer; scene: THREE.Scene; camera: THREE.PerspectiveCamera
  simScene: THREE.Scene; simCamera: THREE.OrthographicCamera
  simMaterial!: THREE.ShaderMaterial; renderMaterial!: THREE.ShaderMaterial
  mesh!: THREE.Points; rt1!: THREE.WebGLRenderTarget; rt2!: THREE.WebGLRenderTarget
  posTex!: THREE.DataTexture; posNearestTex!: THREE.DataTexture; clock: THREE.Clock
  size = 256; count = 0; width: number; height: number; pixelRatio: number
  density: number; particlesScale: number; cameraZoom: number
  colors: [string, string, string]; transparent: boolean
  time = 0; lastTime = 0; hoverProgress = 0; pulseProgress = 0
  mouseIsOver = false; everRendered = false

  constructor(canvas: HTMLCanvasElement, props: MorphingParticlesProps & { colors: [string, string, string] }) {
    this.density = props.density ?? 130
    this.particlesScale = props.particlesScale ?? 0.5
    this.cameraZoom = props.cameraZoom ?? 7.5
    this.colors = props.colors
    this.transparent = props.transparent ?? false
    
    const rect = canvas.getBoundingClientRect()
    this.width = rect.width || 600; this.height = rect.height || 600
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)
    canvas.width = this.width * this.pixelRatio; canvas.height = this.height * this.pixelRatio

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
    this.renderer.setSize(this.width, this.height); this.renderer.setPixelRatio(this.pixelRatio)
    this.scene = new THREE.Scene()
    if (!this.transparent) {
      this.scene.background = new THREE.Color('#ffffff')
    }
    this.camera = new THREE.PerspectiveCamera(40, this.width / this.height, 0.1, 1000)
    this.camera.position.z = this.cameraZoom
    this.simScene = new THREE.Scene(); this.simCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    this.clock = new THREE.Clock()
    this.initAsync(props.texturePath)
  }

  updateColors(colors: [string, string, string]) {
    this.colors = colors
    if (this.renderMaterial) {
      this.renderMaterial.uniforms.uColor1.value = new THREE.Color(colors[0])
      this.renderMaterial.uniforms.uColor2.value = new THREE.Color(colors[1])
      this.renderMaterial.uniforms.uColor3.value = new THREE.Color(colors[2])
    }
  }

  async initAsync(texturePath: string) {
    const imageData = await loadImageData(texturePath)
    const minDist = mapRange(this.density, 0, 300, 10, 2), maxDist = mapRange(this.density, 0, 300, 11, 3)
    const basePoints = poissonDiskSampling(500, 500, minDist, maxDist)
    this.count = basePoints.length
    const nearestPoints = findNearestShapePoints(basePoints, imageData)
    const length = this.size * this.size, posData = new Float32Array(length * 4), nearestData = new Float32Array(length * 4)
    for (let i = 0; i < this.count; i++) {
      const bp = basePoints[i], np = nearestPoints[i], idx = i * 4
      posData[idx] = (bp[0] - 250) / 250; posData[idx + 1] = (bp[1] - 250) / 250
      nearestData[idx] = (np[0] - 250) / 250; nearestData[idx + 1] = (np[1] - 250) / 250
    }
    this.posTex = new THREE.DataTexture(posData, this.size, this.size, THREE.RGBAFormat, THREE.FloatType); this.posTex.needsUpdate = true
    this.posNearestTex = new THREE.DataTexture(nearestData, this.size, this.size, THREE.RGBAFormat, THREE.FloatType); this.posNearestTex.needsUpdate = true
    const rtOpts = { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat, type: THREE.FloatType, depthBuffer: false }
    this.rt1 = new THREE.WebGLRenderTarget(this.size, this.size, rtOpts); this.rt2 = new THREE.WebGLRenderTarget(this.size, this.size, rtOpts)
    this.renderer.setRenderTarget(this.rt1); this.renderer.setClearColor(0x000000, 0); this.renderer.clear()
    this.renderer.setRenderTarget(this.rt2); this.renderer.clear(); this.renderer.setRenderTarget(null)
    this.createSimMaterial(); this.createRenderMaterial(); this.createMesh()
  }

  createSimMaterial() {
    this.simMaterial = new THREE.ShaderMaterial({
      uniforms: { uPosition: { value: this.posTex }, uPosRefs: { value: this.posTex }, uPosNearest: { value: this.posNearestTex }, uTime: { value: 0 }, uIsHovering: { value: 0 } },
      vertexShader: `void main() { gl_Position = vec4(position, 1.0); }`,
      fragmentShader: `precision highp float; uniform sampler2D uPosition, uPosRefs, uPosNearest; uniform float uTime, uIsHovering;
        vec2 hash(vec2 p) { p = vec2(dot(p, vec2(2127.1, 81.17)), dot(p, vec2(1269.5, 283.37))); return fract(sin(p) * 43758.5453); }
        void main() { vec2 uv = gl_FragCoord.xy / ${this.size.toFixed(1)}; vec4 pFrame = texture2D(uPosition, uv);
          float scale = pFrame.z, velocity = pFrame.w; vec2 refPos = texture2D(uPosRefs, uv).xy, nearestPos = texture2D(uPosNearest, uv).xy;
          float seed = hash(uv).x, seed2 = hash(uv).y, time = uTime * 0.5, lifeEnd = 3.0 + sin(seed2 * 100.0), lifeTime = mod((seed * 100.0) + time, lifeEnd);
          vec2 pos = pFrame.xy, targetPos = mix(refPos, nearestPos, uIsHovering * uIsHovering);
          vec2 direction = normalize(targetPos - pos) * 0.01; float dist = length(targetPos - pos), distStrength = smoothstep(0.15, 0.0, dist);
          if (dist > 0.005) pos += direction * distStrength; if (lifeTime < 0.01) { pos = refPos; scale = 0.0; }
          float targetScale = smoothstep(0.01, 0.5, lifeTime) - smoothstep(0.5, 1.0, lifeTime / lifeEnd) + smoothstep(0.1, 0.0, smoothstep(0.001, 0.1, dist)) * 1.5 * uIsHovering;
          scale += (targetScale - scale) * 0.1; velocity = smoothstep(0.15, 0.001, dist) * uIsHovering;
          gl_FragColor = vec4(pFrame.xy + (pos - pFrame.xy) * 0.2, scale, velocity); }`
    })
    this.simScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.simMaterial))
  }

  createRenderMaterial() {
    this.renderMaterial = new THREE.ShaderMaterial({
      uniforms: { uPosition: { value: this.posTex }, uTime: { value: 0 }, uColor1: { value: new THREE.Color(this.colors[0]) }, uColor2: { value: new THREE.Color(this.colors[1]) }, uColor3: { value: new THREE.Color(this.colors[2]) },
        uAlpha: { value: 1 }, uIsHovering: { value: 0 }, uPulseProgress: { value: 0 }, uParticleScale: { value: this.width / this.pixelRatio / 2000 * this.particlesScale }, uPixelRatio: { value: this.pixelRatio } },
      vertexShader: `precision highp float; attribute vec4 seeds; uniform sampler2D uPosition; uniform float uTime, uParticleScale, uPixelRatio, uIsHovering, uPulseProgress; varying float vVelocity, vScale;
        ${noiseGLSL}
        void main() { vec4 pos = texture2D(uPosition, uv);
          float noiseX = snoise(vec3(pos.xy * 10.0, uTime * 0.2 + 100.0)), noiseY = snoise(vec3(pos.xy * 10.0, uTime * 0.2));
          float noiseX2 = snoise(vec3(pos.xy * 0.5, uTime * 0.15 + 45.0)), noiseY2 = snoise(vec3(pos.xy * 0.5, uTime * 0.15 + 87.0));
          float cDist = length(pos.xy), t = (smoothstep(uPulseProgress - 0.25, uPulseProgress, cDist) - smoothstep(uPulseProgress, uPulseProgress + 0.25, cDist)) * smoothstep(1.0, 0.0, cDist);
          pos.xy *= 1.0 + t * 0.02; float dist = mix(0.0, smoothstep(0.0, 0.9, pos.w), uIsHovering);
          pos.y += noiseY * 0.005 * dist + noiseY2 * 0.02; pos.x += noiseX * 0.005 * dist + noiseX2 * 0.02;
          vVelocity = pos.w; vScale = pos.z; gl_Position = projectionMatrix * modelViewMatrix * vec4(pos.xy, 0.0, 1.0);
          gl_PointSize = (vScale * 7.0 * uPixelRatio * 0.5 * uParticleScale) + uPixelRatio; }`,
      fragmentShader: `precision highp float; varying float vScale, vVelocity; uniform vec3 uColor1, uColor2, uColor3; uniform float uAlpha;
        void main() { vec2 uv = gl_PointCoord.xy - 0.5; uv.y *= -1.0; float h = 0.8;
          vec3 col = mix(mix(uColor1, uColor2, vVelocity / h), mix(uColor2, uColor3, (vVelocity - h) / (1.0 - h)), step(h, vVelocity));
          float a = uAlpha * smoothstep(0.5, 0.45, length(uv)) * smoothstep(0.1, 0.2, vScale); if (a < 0.01) discard;
          gl_FragColor = vec4(clamp(col, 0.0, 1.0), clamp(a, 0.0, 1.0)); }`,
      transparent: true, depthTest: false, depthWrite: false
    })
  }

  createMesh() {
    const geometry = new THREE.BufferGeometry(), uvs = new Float32Array(this.count * 2), seeds = new Float32Array(this.count * 4)
    for (let i = 0; i < this.count; i++) { uvs[i * 2] = (i % this.size) / this.size; uvs[i * 2 + 1] = Math.floor(i / this.size) / this.size; for (let j = 0; j < 4; j++) seeds[i * 4 + j] = Math.random() }
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.count * 3), 3))
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2)); geometry.setAttribute('seeds', new THREE.BufferAttribute(seeds, 4))
    this.mesh = new THREE.Points(geometry, this.renderMaterial); this.mesh.scale.set(5, -5, 5); this.scene.add(this.mesh)
  }

  onHoverStart() { this.mouseIsOver = true }
  onHoverEnd() { this.mouseIsOver = false }

  update() {
    if (!this.mesh || !this.simMaterial || !this.renderMaterial) return
    const dt = this.clock.getDelta(); this.lastTime = this.clock.getElapsedTime()
    this.hoverProgress += ((this.mouseIsOver ? 1 : 0) - this.hoverProgress) * 0.05
    if (this.mouseIsOver) { this.pulseProgress += dt * 0.5; if (this.pulseProgress > 1.5) this.pulseProgress = 0 }
    this.simMaterial.uniforms.uPosition.value = this.everRendered ? this.rt1.texture : this.posTex
    this.simMaterial.uniforms.uTime.value = this.lastTime; this.simMaterial.uniforms.uIsHovering.value = this.hoverProgress
    this.renderer.setRenderTarget(this.rt2); this.renderer.render(this.simScene, this.simCamera); this.renderer.setRenderTarget(null)
    this.renderMaterial.uniforms.uPosition.value = this.everRendered ? this.rt2.texture : this.posTex
    this.renderMaterial.uniforms.uTime.value = this.lastTime; this.renderMaterial.uniforms.uIsHovering.value = this.hoverProgress
    this.renderMaterial.uniforms.uPulseProgress.value = this.pulseProgress; this.renderer.render(this.scene, this.camera)
    const tmp = this.rt1; this.rt1 = this.rt2; this.rt2 = tmp; this.everRendered = true
  }

  dispose() {
    this.mesh?.geometry.dispose(); this.simMaterial?.dispose(); this.renderMaterial?.dispose()
    this.rt1?.dispose(); this.rt2?.dispose(); this.posTex?.dispose(); this.posNearestTex?.dispose(); this.renderer.dispose()
  }
}

export function MorphingParticles({ texturePath, className = '', transparent = false, colors, darkColors, ...props }: MorphingParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<ParticleEngine | null>(null)
  const rafRef = useRef<number>(0)

  const handleMouseEnter = useCallback(() => engineRef.current?.onHoverStart(), [])
  const handleMouseLeave = useCallback(() => engineRef.current?.onHoverEnd(), [])

  // 检测当前主题
  const getIsDark = () => {
    if (typeof window === 'undefined') return false
    return document.documentElement.classList.contains('dark')
  }

  const lightColors: [string, string, string] = colors ?? ['#006ffd', '#2897ff', '#6fbaff']
  const darkModeColors: [string, string, string] = darkColors ?? ['#ffffff', '#f0f0f0', '#e0e0e0']

  useEffect(() => {
    if (!canvasRef.current) return
    const isDark = getIsDark()
    const currentColors = isDark ? darkModeColors : lightColors
    engineRef.current = new ParticleEngine(canvasRef.current, { texturePath, transparent, colors: currentColors, ...props })
    const animate = () => { engineRef.current?.update(); rafRef.current = requestAnimationFrame(animate) }
    animate()

    // 监听主题变化
    const observer = new MutationObserver(() => {
      const isDarkNow = getIsDark()
      const newColors = isDarkNow ? darkModeColors : lightColors
      engineRef.current?.updateColors(newColors)
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => { observer.disconnect(); cancelAnimationFrame(rafRef.current); engineRef.current?.dispose() }
  }, [texturePath, transparent, props, lightColors, darkModeColors])

  return <canvas ref={canvasRef} className={`w-full h-full ${className}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
}
