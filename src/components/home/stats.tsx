export default function Stats() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-800 bg-zinc-900 p-8 text-center">
          <h2 className="text-4xl font-bold text-white">10K+</h2>
          <p className="mt-2 text-gray-400">Books Available</p>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-zinc-900 p-8 text-center">
          <h2 className="text-4xl font-bold text-white">5K+</h2>
          <p className="mt-2 text-gray-400">Active Readers</p>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-zinc-900 p-8 text-center">
          <h2 className="text-4xl font-bold text-white">100+</h2>
          <p className="mt-2 text-gray-400">Book Categories</p>
        </div>
      </div>
    </section>
  );
}