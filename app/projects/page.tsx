import Link from 'next/link'

const projects = [
  {
    id: 'project-1',
    title: '示例项目',
    description: '这是一个示例项目描述',
    tags: ['React', 'TypeScript'],
  },
]

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold">作品集</h1>
      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="group rounded-lg border border-neutral-200 p-6 transition-all hover:border-primary hover:shadow-sm"
          >
            <h2 className="mb-2 font-semibold group-hover:text-primary">
              {project.title}
            </h2>
            <p className="mb-4 text-sm text-neutral-100">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-primary-lightest px-2 py-1 text-xs text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
