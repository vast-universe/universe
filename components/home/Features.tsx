export default function Features() {
  return (
    <div className="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="lg:max-w-lg">
              <p className="text-base font-semibold text-primary">关于我</p>
              <h1 className="mt-2 text-pretty text-4xl font-semibold tracking-tight sm:text-5xl">
                专注于创造价值
              </h1>
              <p className="mt-6 text-xl text-neutral-100">
                多年全栈开发经验，热衷于用技术解决实际问题。追求代码质量和用户体验的完美平衡。
              </p>
            </div>
          </div>
        </div>

        <div className="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
          <img
            alt="项目截图"
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=800&fit=crop"
            className="w-[48rem] max-w-none rounded-xl bg-neutral-400 shadow-xl ring-1 ring-neutral-200 sm:w-[57rem]"
          />
        </div>

        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="max-w-xl text-base text-neutral-100 lg:max-w-lg">
              <p>
                我相信好的代码应该像好的文章一样清晰易读。在开发过程中，我始终关注代码的可维护性、
                可扩展性和性能优化，同时也注重用户体验和产品细节。
              </p>

              <ul role="list" className="mt-8 space-y-8">
                <li className="flex gap-x-3">
                  <svg className="mt-1 size-5 flex-none text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>
                    <strong className="font-semibold text-foreground">快速迭代</strong>{" "}
                    采用敏捷开发方法，快速验证想法，持续交付价值。从原型到产品，高效推进每个环节。
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <svg className="mt-1 size-5 flex-none text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>
                    <strong className="font-semibold text-foreground">代码质量</strong>{" "}
                    注重代码规范和测试覆盖，使用 TypeScript 确保类型安全，让代码更加健壮可靠。
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <svg className="mt-1 size-5 flex-none text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                  </svg>
                  <span>
                    <strong className="font-semibold text-foreground">全栈思维</strong>{" "}
                    从前端到后端，从数据库到部署，具备完整的技术视野，能够独立完成产品开发。
                  </span>
                </li>
              </ul>

              <p className="mt-8">
                除了日常开发工作，我也热衷于技术分享和开源贡献。通过写博客、参与社区讨论，
                与更多开发者交流学习，共同成长。
              </p>

              <h2 className="mt-16 text-2xl font-bold tracking-tight">持续学习，永不止步</h2>
              <p className="mt-6">
                技术日新月异，保持学习的热情是我一直坚持的事情。无论是新的框架、新的工具，
                还是新的编程范式，我都愿意去探索和尝试，不断拓展自己的技术边界。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
