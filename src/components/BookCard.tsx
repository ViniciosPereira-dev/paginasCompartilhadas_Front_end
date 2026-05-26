type BookCardProps = {
  title: string;
  author: string;
  genre: string;
  owner: string;
};

export default function BookCard({
  title,
  author,
  genre,
  owner,
}: BookCardProps) {
  return (
    <div className="group overflow-hidden rounded-2xl borderborder-white/10 bg-gray-800 shadow-sm ">
      {/* Capa fake temporária */}
      <div className="flex h-64 items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
        <span className="text-6xl">📚</span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-h-[56px] line-clamp-2 text-lg font-semibold text-white">
            {title}
          </h3>

          <span className="shrink-0 inline-flex items-center rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
            {genre}
          </span>
        </div>

        <p className="mt-2 text-sm text-gray-300">{author}</p>

        <div className="mt-4 border-t border-gray-100 pt-4">
          <p className="text-uppercase tracking-wide text-sm text-gray-400">
            Compartilhado por
          </p>

          <p className="mt-1 text-sm font-medium text-gray-700">{owner}</p>
        </div>

        <button className="mt-5 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500">
          Solicitar Livro
        </button>
      </div>
    </div>
  );
}
