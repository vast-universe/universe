'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('theme')
    if (stored === 'dark' || stored === 'light') {
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(stored)
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.add('light')
    }
  }, [])

  const toggleTheme = () => {
    const isLight = document.documentElement.classList.contains('light')
    if (isLight) {
      document.documentElement.classList.remove('light')
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
      localStorage.setItem('theme', 'light')
    }
  }

  if (!mounted) {
    return (
      <button className="flex h-9 w-9 items-center justify-center">
        <div className="h-6 w-6" />
      </button>
    )
  }

  return (
    <>
      <button
        onClick={toggleTheme}
        className="flex h-9 w-9 items-center justify-center rounded-lg"
        aria-label="切换主题"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 472.39 472.39"
          className="fill-black dark:fill-[#f3d05e]"
        >
          <g className="toggle-sun">
            <path d="M403.21,167V69.18H305.38L236.2,0,167,69.18H69.18V167L0,236.2l69.18,69.18v97.83H167l69.18,69.18,69.18-69.18h97.83V305.38l69.18-69.18Zm-167,198.17a129,129,0,1,1,129-129A129,129,0,0,1,236.2,365.19Z" />
          </g>
          <g className="toggle-circle">
            <circle cx="236.2" cy="236.2" r="103.78" />
          </g>
        </svg>
      </button>

      <style jsx global>{`
        .toggle-circle {
          transition: transform 500ms ease-out;
        }
        .light .toggle-circle {
          transform: translateX(-15%);
        }
        .toggle-sun {
          transform-origin: center center;
          transition: transform 750ms cubic-bezier(0.11, 0.14, 0.29, 1.32);
        }
        .light .toggle-sun {
          transform: rotate(0.5turn);
        }
      `}</style>
    </>
  )
}
