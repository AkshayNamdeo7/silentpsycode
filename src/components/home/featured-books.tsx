export default function FeaturedBooks() {
  const books = [
    {
      title: "Atomic Habits",
      author: "James Clear",
      price: "₹499",
    },
    {
      title: "The Alchemist",
      author: "Paulo Coelho",
      price: "₹399",
    },
    {
      title: "Rich Dad Poor Dad",
      author: "Robert Kiyosaki",
      price: "₹599",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <h2 className="mb-10 text-center text-4xl font-bold text-white">
        Featured Books
      </h2>

      <div className="grid gap-8 md:grid-cols-3">
        {books.map((book) => (
          <div
            key={book.title}
            className="overflow-hidden rounded-2xl border border-gray-800 bg-zinc-900"
          >
            <div className="flex h-64 items-center justify-center bg-zinc-800 text-6xl">
              📚
            </div>

            <div className="p-6">
              <h3 className="text-xl font-semibold text-white">
                {book.title}
              </h3>

              <p className="mt-2 text-gray-400">{book.author}</p>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-lg font-bold text-green-400">
                  {book.price}
                </span>

                <button className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}