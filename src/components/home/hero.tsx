export default function Hero() {
  return (
    <section className="mx-auto flex min-h-[80vh] max-w-7xl flex-col items-center justify-center px-6 text-center">
      <h1 className="mb-6 text-6xl font-extrabold text-white">
        Discover Books Smarter
      </h1>

      <p className="max-w-2xl text-xl text-gray-400">
        India's next generation AI-powered marketplace to buy, sell and discover books.
      </p>

      <button className="mt-10 rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-blue-500">
        Get Started
      </button>
    </section>
  );
}