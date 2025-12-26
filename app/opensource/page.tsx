const repos = [
  {
    name: '示例仓库',
    description: '这是一个示例开源项目',
    url: 'https://github.com/username/repo',
    stars: 0,
    language: 'TypeScript',
  },
]

export default function OpenSourcePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold">开源项目</h1>
      <div className="grid gap-4">
        {repos.map((repo) => (
          <a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg border border-neutral-200 p-4 transition-all hover:border-primary hover:shadow-sm"
          >
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-semibold">{repo.name}</h2>
              <span className="text-sm text-neutral-100">⭐ {repo.stars}</span>
            </div>
            <p className="mb-2 text-sm text-neutral-100">{repo.description}</p>
            <span className="inline-block rounded bg-primary-lightest px-2 py-1 text-xs text-primary">
              {repo.language}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
