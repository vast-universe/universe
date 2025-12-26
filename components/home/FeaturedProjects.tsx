import Link from "next/link";

const featuredProjects = [
  {
    id: "project-1",
    title: "智能文档系统",
    description: "基于 AI 的文档管理与知识库系统，支持智能搜索和自动分类",
    tags: ["React", "TypeScript", "AI"],
  },
  {
    id: "project-2",
    title: "开源组件库",
    description: "一套精心设计的 React 组件库，注重可访问性和开发体验",
    tags: ["React", "Tailwind"],
  },
  {
    id: "project-3",
    title: "效率工具集",
    description: "提升开发效率的命令行工具和 VS Code 插件",
    tags: ["Node.js", "CLI"],
  },
];

export default function FeaturedProjects() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">精选项目</h2>
        <p className="mt-4 text-neutral-100">一些我引以为豪的作品</p>
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {featuredProjects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="group relative rounded-2xl border border-neutral-200 bg-background p-6 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-xl"
          >
            <h3 className="text-lg font-semibold group-hover:text-primary">
              {project.title}
            </h3>
            <p className="mt-3 text-sm text-neutral-100">{project.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link href="/projects" className="text-sm font-semibold text-primary hover:text-primary-dark">
          查看全部项目 <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
