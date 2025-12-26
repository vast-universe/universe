import Link from "next/link";

const recentPosts = [
  { slug: "react-hooks", title: "深入理解 React Hooks 的工作原理", date: "2024-12-20" },
  { slug: "react-basics", title: "从零开始学习 React 核心概念", date: "2024-12-18" },
  { slug: "welcome", title: "TypeScript 高级类型体操指南", date: "2024-12-15" },
];

export default function RecentPosts() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">最新文章</h2>
        <p className="mt-4 text-neutral-100">技术思考与学习笔记</p>
      </div>

      <div className="mx-auto mt-16 max-w-3xl space-y-4">
        {recentPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/docs/${post.slug}`}
            className="group flex items-center justify-between rounded-xl border border-neutral-200 bg-background p-5 transition-all hover:border-primary hover:shadow-lg"
          >
            <h3 className="font-semibold group-hover:text-primary">{post.title}</h3>
            <div className="flex items-center gap-4">
              <span className="hidden text-sm text-neutral-100 sm:block">{post.date}</span>
              <span className="text-primary">→</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link href="/docs" className="text-sm font-semibold text-primary hover:text-primary-dark">
          查看全部文章 <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
