export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 py-8">
      <div className="mx-auto max-w-4xl px-4 text-center text-sm text-neutral-100">
        © {new Date().getFullYear()} Universe. All rights reserved.
      </div>
    </footer>
  )
}
