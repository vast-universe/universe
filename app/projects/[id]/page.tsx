import Link from 'next/link'

const projects: Record<string, { title: string; description: string; content: string }> = {
  'project-1': {
    title: '示例项目',
    description: '这是一个示例项目描述',
    content: '这里是项目的详细介绍内容。你可以在这里添加更多关于项目的信息。',
  },
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = projects[id]

  if (!project) {
    return <div>项目不存在</div>
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <Link
        href="/projects"
        className="mb-8 inline-block text-sm text-neutral-100 hover:text-primary"
      >
        ← 返回作品列表
      </Link>
      <h1 className="mb-4 text-3xl font-bold">{project.title}</h1>
      <p className="mb-8 text-neutral-100">{project.description}</p>
      <div className="prose prose-neutral dark:prose-invert">{project.content}</div>
    </div>
  )
}

export function generateStaticParams() {
  return Object.keys(projects).map((id) => ({ id }))
}
