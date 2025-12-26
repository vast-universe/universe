import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative isolate px-6 lg:px-8">
      {/* 顶部渐变背景 */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-primary-dark opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>

      {/* Hero 内容 */}
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        {/* 状态标签 */}
        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          <div className="relative inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm text-neutral-100 ring-1 ring-neutral-200 hover:ring-neutral-100">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            开放合作中
            <Link href="/projects" className="font-semibold text-primary">
              <span aria-hidden="true" className="absolute inset-0" />
              查看项目 <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* 主标题 */}
        <div className="text-center">
          <h1 className="text-balance text-5xl font-semibold tracking-tight sm:text-7xl">
            构建优雅的
            <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              {" "}数字体验
            </span>
          </h1>
          <p className="mt-8 text-pretty text-lg font-medium text-neutral-100 sm:text-xl">
            全栈开发者，专注于创造简洁、高效、用户友好的产品。
            <br className="hidden sm:block" />
            热爱开源，乐于分享，持续学习。
          </p>

          {/* CTA 按钮 */}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/projects"
              className="rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              查看作品
            </Link>
            <Link href="/docs" className="text-sm font-semibold">
              阅读文档 <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 底部渐变背景 */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary to-primary-dark opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
        />
      </div>
    </div>
  );
}
