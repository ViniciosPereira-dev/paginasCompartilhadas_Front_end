import { useState } from "react";
import {
  ExclamationTriangleIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import { obterCapaPorIsbn, CAPA_PADRAO } from "../utils/bookHelpers";
import { Toast } from "./Toast";
import { useAuth } from "../contexts/AuthContext";

type BookCardProps = {
  id: number;
  title: string;
  author: string;
  genre: string;
  owner: string;
  isbn: string;
  userId: number; 
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
  userId, // <-- RECEBA COMO 'userId' AQUI TAMBÉM
  isOwner = false,
  onDeleteSuccess,
}: BookCardProps) {
  const { idUsuario } = useAuth();

  // ================= ESTADOS =================
  const [isModalAberto, setIsModalAberto] = useState(false);
  const [isModalDeletarAberto, setIsModalDeletarAberto] = useState(false);

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

  // ================= REGRAS =================
  const eOMeuProprioLivro = userId === idUsuario;

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
        mostrarToast("Livro removido com sucesso!", "success");

        setIsModalDeletarAberto(false);

        setTimeout(() => {
          if (onDeleteSuccess) {
            onDeleteSuccess();
          }
        }, 1200);
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
        }, 1200);
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
    <>
      {/* ================= TOAST ================= */}
      {toast && (
        <Toast
          mensagem={toast.mensagem}
          tipo={toast.tipo}
          onClose={() => setToast(null)}
        />
      )}

      {/* ================= CARD ================= */}
      <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gray-800 shadow-lg transition hover:-translate-y-1 hover:border-indigo-500/30">

        {/* CAPA */}
        <div className="relative h-72 overflow-hidden bg-gray-700">
          <img
            src={obterCapaPorIsbn(isbn)}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = CAPA_PADRAO;
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          <span className="absolute right-3 top-3 rounded-full bg-indigo-500/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {genre}
          </span>
        </div>

        {/* CONTEÚDO */}
        <div className="flex flex-col p-5">
          <h3 className="line-clamp-2 min-h-[56px] text-lg font-bold text-white">
            {title}
          </h3>

          <p className="mt-2 text-sm text-gray-300">
            {author}
          </p>

          <div className="mt-4 border-t border-white/10 pt-4">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Compartilhado por
            </p>

            <p className="mt-1 text-sm font-medium text-gray-200">
              {owner}
            </p>
          </div>

          {/* BOTÕES */}
          <div className="mt-5">
            {isOwner ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalAberto(true)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-gray-700 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-600"
                >
                  <PencilSquareIcon className="h-4 w-4" />
                  Editar
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setIsModalDeletarAberto(true)
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-600/20 px-3 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-600 hover:text-white"
                >
                  <TrashIcon className="h-4 w-4" />
                  Excluir
                </button>
              </div>
            ) : eOMeuProprioLivro ? (
              <button
                disabled
                className="w-full cursor-not-allowed rounded-xl border border-white/5 bg-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-400"
              >
                Seu Livro
              </button>
            ) : (
              <button className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500">
                Solicitar Livro
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================= MODAL EDITAR ================= */}
      {isModalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-gray-900 p-6 text-white shadow-2xl">

            <div className="mb-6">
              <h3 className="text-xl font-bold">
                Editar Livro
              </h3>

              <p className="mt-1 text-sm text-gray-400">
                Atualize as informações abaixo.
              </p>
            </div>

            <form
              onSubmit={handleSalvarEdicao}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Título
                </label>

                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) =>
                    setEditTitle(e.target.value)
                  }
                  className="mt-2 block w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Autor
                </label>

                <input
                  type="text"
                  required
                  value={editAuthor}
                  onChange={(e) =>
                    setEditAuthor(e.target.value)
                  }
                  className="mt-2 block w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Gênero
                  </label>

                  <input
                    type="text"
                    required
                    value={editGenre}
                    onChange={(e) =>
                      setEditGenre(e.target.value)
                    }
                    className="mt-2 block w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    ISBN
                  </label>

                  <input
                    type="text"
                    required
                    value={editIsbn}
                    onChange={(e) =>
                      setEditIsbn(e.target.value)
                    }
                    className="mt-2 block w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 border-t border-white/10 pt-5">
                <button
                  type="button"
                  onClick={() => setIsModalAberto(false)}
                  className="flex-1 rounded-xl border border-white/10 bg-gray-800 px-4 py-2.5 text-sm font-semibold text-gray-300 transition hover:bg-gray-700"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSalvando}
                  className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
                >
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-gray-900 p-6 text-center text-white shadow-2xl">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
              <ExclamationTriangleIcon className="h-7 w-7 text-red-400" />
            </div>

            <h3 className="mt-4 text-xl font-bold">
              Remover Livro
            </h3>

            <p className="mt-2 text-sm text-gray-400">
              Tem certeza que deseja excluir{" "}
              <span className="font-semibold text-white">
                "{title}"
              </span>
              ?
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Essa ação não poderá ser desfeita.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() =>
                  setIsModalDeletarAberto(false)
                }
                className="flex-1 rounded-xl border border-white/10 bg-gray-800 px-4 py-2.5 text-sm font-semibold text-gray-300 transition hover:bg-gray-700"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={isDeletando}
                onClick={handleAcaoDeletar}
                className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
              >
                {isDeletando
                  ? "Excluindo..."
                  : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}