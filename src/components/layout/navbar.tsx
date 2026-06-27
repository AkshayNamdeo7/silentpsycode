export default function Navbar() {
  return (
    <header className="w-full border-b border-gray-800">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <h1 className="text-2xl font-bold text-white">
          Silent Psycode
        </h1>

        <button className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-500">
          Coming Soon
        </button>
      </nav>
    </header>
  );
}