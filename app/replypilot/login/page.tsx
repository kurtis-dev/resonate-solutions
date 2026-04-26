export default function LoginPage() {
  return (
    <main className="mx-auto flex max-w-xl px-5 py-16">
      <section className="w-full rounded-lg border border-line bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">Account</p>
        <h1 className="mt-3 text-4xl font-black text-ink">Login placeholder</h1>
        <p className="mt-4 leading-7 text-muted">
          This page is ready for an authentication provider such as Clerk, Supabase Auth, Auth.js, or Firebase Auth.
        </p>
        <form className="mt-8 grid gap-4">
          <input className="rounded-lg border border-line px-3 py-3" placeholder="Email address" type="email" />
          <input className="rounded-lg border border-line px-3 py-3" placeholder="Password" type="password" />
          <button className="rounded-lg bg-ink px-5 py-3 font-black text-white" type="button">Login coming soon</button>
        </form>
      </section>
    </main>
  );
}
