'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from '@/components/ThemeToggle'

const navItems = [
  { href: '/', label: '首页' },
  { href: '/docs', label: '文档' },
  { href: '/projects', label: '作品' },
  { href: '/opensource', label: '开源' },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-background/80 backdrop-blur-sm">
      <nav className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold text-primary">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/earth.svg" alt="Earth" className="h-6 w-6" />
          Universe
        </Link>
        <div className="flex items-center gap-6">
          <ul className="flex gap-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`text-sm transition-colors hover:text-primary ${
                    pathname === item.href || pathname.startsWith(item.href + '/')
                      ? 'text-primary font-semibold'
                      : 'text-neutral-100'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
