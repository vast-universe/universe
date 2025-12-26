import Link from 'next/link'

const docs = [
  {
    slug: 'welcome',
    title: '欢迎',
    description: 'MDX 文档入门指南',
  },
]

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold">技术文档</h1>
      <div className="grid gap-4">
        {docs.map((doc) => (
          <Link
            key={doc.slug}
            href={`/docs/${doc.slug}`}
            className="block rounded-lg border border-neutral-200 p-4 transition-all hover:border-primary hover:shadow-sm"
          >
            <h2 className="mb-1 font-semibold">{doc.title}</h2>
            <p className="text-sm text-neutral-100">{doc.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
