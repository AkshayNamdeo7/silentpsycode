export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B1220] text-white flex items-center justify-center px-6">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl font-bold mb-6">
          Welcome to Silent Psycode
        </h1>

        <p className="text-xl text-gray-300 mb-10">
          India's next generation AI-powered book marketplace.
        </p>

        <button className="bg-blue-600 hover:bg-blue-700 transition px-8 py-4 rounded-xl font-semibold">
          Coming Soon
        </button>
      </div>
    </main>
  );
}