export default function ContactCTA() {
  return (
    <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          有想法？一起聊聊，开启合作之旅。
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-pretty text-lg text-neutral-100">
          无论是项目合作、技术交流还是随便聊聊，都欢迎联系我。期待与你的每一次对话。
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="mailto:your@email.com"
            className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            发送邮件
          </a>
          <a
            href="https://github.com/username"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold"
          >
            GitHub <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
