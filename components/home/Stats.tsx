const stats = [
  { label: "开源项目", value: "12+" },
  { label: "技术文章", value: "50+" },
  { label: "GitHub Stars", value: "2k+" },
];

export default function Stats() {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <dl className="grid grid-cols-1 gap-x-8 gap-y-10 text-center sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-y-3">
            <dt className="text-sm text-neutral-100">{stat.label}</dt>
            <dd className="order-first text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
