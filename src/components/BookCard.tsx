import { useState } from "react";
import { obterCapaPorIsbn, CAPA_PADRAO } from "../utils/bookHelpers";
import { Toast } from "./Toast";

type BookCardProps = {
  id: number;
  title: string;
  author: string;
  genre: string;
  owner: string;
  isbn: string;
  isOwner?: boolean;
  onDeleteSuccess?: () => void;
};

export default function BookCard({
  id,
  title,
  author,
  genre,
  owner,
  isbn,
  isOwner = false,
  onDeleteSuccess,
}: BookCardProps) {
  // ================= ESTADOS =================

  const [isModalAberto, setIsModalAberto] = useState(false);
  const [isModalDeletarAberto, setIsModalDeletarAberto] =
    useState(false);

  const [editTitle, setEditTitle] = useState(title);
  const [editAuthor, setEditAuthor] = useState(author);
  const [editGenre, setEditGenre] = useState(genre);
  const [editIsbn, setEditIsbn] = useState(isbn);

  const [isSalvando, setIsSalvando] = useState(false);
  const [isDeletando, setIsDeletando] = useState(false);

  const [toast, setToast] = useState<{
    mensagem: string;
    tipo: "success" | "error";
  } | null>(null);

  // ================= TOAST =================

  const mostrarToast = (
    mensagem: string,
    tipo: "success" | "error"
  ) => {
    setToast({ mensagem, tipo });
  };

  // ================= DELETE =================

  const handleAcaoDeletar = async () => {
    setIsDeletando(true);

    try {
      const { default: api } = await import("../services/api");

      const response = await api.delete(`/books/${id}`);

      if (response.data.success) {
        mostrarToast(
          "Livro removido com sucesso!",
          "success"
        );

        setIsModalDeletarAberto(false);

        setTimeout(() => {
          if (onDeleteSuccess) {
            onDeleteSuccess();
          }
        }, 1500);
      }
    } catch (error) {
      console.error("Erro ao deletar livro:", error);

      mostrarToast(
        "Não foi possível excluir este livro.",
        "error"
      );
    } finally {
      setIsDeletando(false);
    }
  };

  // ================= UPDATE =================

  const handleSalvarEdicao = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setIsSalvando(true);

    try {
      const { default: api } = await import("../services/api");

      const response = await api.put(`/books/${id}`, {
        title: editTitle,
        author: editAuthor,
        genre: editGenre,
        isbn: editIsbn,
      });

      if (response.data.success) {
        mostrarToast(
          "Livro atualizado com sucesso!",
          "success"
        );

        setIsModalAberto(false);

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error("Erro ao atualizar livro:", error);

      mostrarToast(
        "Não foi possível salvar as alterações.",
        "error"
      );
    } finally {
      setIsSalvando(false);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gray-800 shadow-sm">
      
      {/* ================= TOAST ================= */}

      {toast && (
        <Toast
          mensagem={toast.mensagem}
          tipo={toast.tipo}
          onClose={() => setToast(null)}
        />
      )}

      {/* ================= CAPA ================= */}

      <div className="relative h-64 overflow-hidden bg-gray-700">
        <img
          src={obterCapaPorIsbn(isbn)}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = CAPA_PADRAO;
          }}
        />
      </div>

      {/* ================= CONTEÚDO ================= */}

      <div className="p-5">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 min-h-[56px] text-lg font-semibold text-white">
            {title}
          </h3>

          <span className="shrink-0 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
            {genre}
          </span>
        </div>

        {/* Autor */}
        <p className="mt-2 text-sm text-gray-300">
          {author}
        </p>

        {/* Owner */}
        <div className="mt-4 border-t border-white/10 pt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Compartilhado por
          </p>

          <p className="mt-1 text-sm font-medium text-gray-200">
            {owner}
          </p>
        </div>

        {/* ================= BOTÕES ================= */}

        <div className="mt-5">
          {isOwner ? (
            <div className="flex gap-2">
              
              {/* Editar */}
              <button
                type="button"
                onClick={() => setIsModalAberto(true)}
                className="flex-1 rounded-lg border border-white/10 bg-gray-700 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-600"
              >
                Editar
              </button>

              {/* Excluir */}
              <button
                type="button"
                onClick={() =>
                  setIsModalDeletarAberto(true)
                }
                className="flex-1 rounded-lg border border-red-500/20 bg-red-600/20 px-3 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-600 hover:text-white"
              >
                Excluir
              </button>
            </div>
          ) : (
            <button className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500">
              Solicitar Livro
            </button>
          )}
        </div>
      </div>

      {/* ================= MODAL EDITAR ================= */}

      {isModalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-gray-900 p-6 text-white shadow-2xl">
            
            {/* Header */}
            <div className="mb-6">
              <h3 className="text-xl font-bold">
                Editar Informações
              </h3>

              <p className="mt-1 text-xs text-gray-400">
                Altere os dados do livro selecionado.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSalvarEdicao}
              className="space-y-4"
            >
              
              {/* Título */}
              <div>
                <label className="block text-xs font-medium text-gray-300">
                  Título
                </label>

                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) =>
                    setEditTitle(e.target.value)
                  }
                  className="mt-1 block w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-white outline outline-1 outline-white/10 transition focus:outline-indigo-500"
                />
              </div>

              {/* Autor */}
              <div>
                <label className="block text-xs font-medium text-gray-300">
                  Autor
                </label>

                <input
                  type="text"
                  required
                  value={editAuthor}
                  onChange={(e) =>
                    setEditAuthor(e.target.value)
                  }
                  className="mt-1 block w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-white outline outline-1 outline-white/10 transition focus:outline-indigo-500"
                />
              </div>

              {/* Grid */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Gênero */}
                <div>
                  <label className="block text-xs font-medium text-gray-300">
                    Gênero
                  </label>

                  <input
                    type="text"
                    required
                    value={editGenre}
                    onChange={(e) =>
                      setEditGenre(e.target.value)
                    }
                    className="mt-1 block w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-white outline outline-1 outline-white/10 transition focus:outline-indigo-500"
                  />
                </div>

                {/* ISBN */}
                <div>
                  <label className="block text-xs font-medium text-gray-300">
                    ISBN
                  </label>

                  <input
                    type="text"
                    required
                    value={editIsbn}
                    onChange={(e) =>
                      setEditIsbn(e.target.value)
                    }
                    className="mt-1 block w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-white outline outline-1 outline-white/10 transition focus:outline-indigo-500"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 border-t border-white/10 pt-4">
                
                {/* Cancelar */}
                <button
                  type="button"
                  onClick={() =>
                    setIsModalAberto(false)
                  }
                  className="flex-1 rounded-lg border border-white/5 bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-300 transition hover:bg-gray-700"
                >
                  Cancelar
                </button>

                {/* Salvar */}
                <button
                  type="submit"
                  disabled={isSalvando}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
                >
                  {isSalvando && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  )}

                  {isSalvando
                    ? "Salvando..."
                    : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL EXCLUIR ================= */}

      {isModalDeletarAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          
          <div className="w-full max-w-sm space-y-5 rounded-2xl border border-white/10 bg-gray-900 p-6 text-center text-white shadow-2xl">
            
            {/* Ícone */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-.01-10a9 9 0 100 18 9 9 0 000-18z"
                />
              </svg>
            </div>

            {/* Texto */}
            <div>
              <h3 className="text-xl font-bold">
                Remover Livro
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                Tem certeza que deseja excluir{" "}
                <span className="font-semibold text-white">
                  "{title}"
                </span>
                ?
              </p>

              <p className="mt-1 text-xs text-red-400">
                Essa ação não poderá ser desfeita.
              </p>
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-2">
              
              {/* Cancelar */}
              <button
                type="button"
                onClick={() =>
                  setIsModalDeletarAberto(false)
                }
                disabled={isDeletando}
                className="flex-1 rounded-lg border border-white/10 bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-300 transition hover:bg-gray-700 disabled:opacity-50"
              >
                Cancelar
              </button>

              {/* Excluir */}
              <button
                type="button"
                onClick={handleAcaoDeletar}
                disabled={isDeletando}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
              >
                {isDeletando && (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}

                {isDeletando
                  ? "Excluindo..."
                  : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}