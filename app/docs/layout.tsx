'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// 文档目录结构
const docsSidebar = [
  {
    title: '入门',
    items: [{ slug: 'welcome', title: '欢迎' }],
  },
  {
    title: 'React',
    items: [
      { slug: 'react-basics', title: 'React 基础' },
      { slug: 'react-hooks', title: 'Hooks 详解' },
    ],
  },
]

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex gap-8">
        {/* 侧边栏 */}
        <aside className="hidden w-56 shrink-0 md:block">
          <nav className="sticky top-20">
            {docsSidebar.map((section) => (
              <div key={section.title} className="mb-6">
                <h3 className="mb-2 text-sm font-semibold text-foreground">
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const href = `/docs/${item.slug}`
                    const isActive = pathname === href
                    return (
                      <li key={item.slug}>
                        <Link
                          href={href}
                          className={`block rounded px-2 py-1 text-sm transition-colors ${
                            isActive
                              ? 'bg-primary-lightest text-primary font-medium'
                              : 'text-neutral-100 hover:text-primary'
                          }`}
                        >
                          {item.title}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* 主内容区 */}
        <main className="min-w-0 flex-1">
          <article className="prose prose-neutral max-w-none dark:prose-invert">
            {children}
          </article>
        </main>
      </div>
    </div>
  )
}
