import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import api from "../services/api";
import type { ApiResponse } from "../types/api";
import {
  buscarLivroPorISBN,
  formatarDataParaBR,
  obterCapaPorIsbn,
} from "../utils/bookHelpers";

export const CreateBook: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [isbn, setIsbn] = useState("");
  const [pubDateHTML, setPubDateHTML] = useState("");
  const [description, setDescription] = useState("");
  const [loadingISBN, setLoadingISBN] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookLoaded, setBookLoaded] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    const dataFormatada = formatarDataParaBR(pubDateHTML);

    const bookData = {
      title,
      author,
      genre,
      isbn,
      publicationDate: dataFormatada,
      description,
      status: "AVAILABLE" as const,
    };

    try {
      const response = await api.post<ApiResponse<any>>("/books", bookData);

      if (response.data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("Erro interno ao tentar cadastrar o livro.");
      }
      setIsLoading(false);
    }
  };

  const preencherDadosLivro = async () => {
    const isbnLimpo = isbn.replace(/\D/g, "");

    if (isbnLimpo.length < 10) return;

    try {
      setLoadingISBN(true);

      const livro = await buscarLivroPorISBN(isbnLimpo);

      setTitle(livro.title);
      setAuthor(livro.author);
      setGenre(livro.genre);
      setDescription(livro.description);

      setBookLoaded(true);

      if (livro.publishedDate) {
        const ano = livro.publishedDate.substring(0, 4);

        if (ano) {
          setPubDateHTML(`${ano}-01-01`);
        }
      }
    } catch (error) {
      setBookLoaded(false);
      console.error("Erro ao buscar livro por ISBN:", error);
    } finally {
      setLoadingISBN(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-gray-900 transition-colors duration-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md bg-gray-800 border border-white/10 p-8 rounded-2xl shadow-xl min-h-[520px] flex flex-col justify-center transition-all duration-300">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center text-center space-y-5 animate-fade-in">
            <div className="flex size-16 items-center justify-center rounded-full bg-green-500/10 animate-pulse">
              <svg
                className="h-10 w-10 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold tracking-tight text-white">
                Livro cadastrado!
              </h3>
              <p className="text-sm text-gray-400 max-w-xs mx-auto">
                Doação registrada com sucesso. Atualizando seu catálogo...
              </p>
            </div>
            <div className="w-48 h-1.5 bg-gray-700 rounded-full overflow-hidden relative">
              <div className="h-full bg-indigo-500 rounded-full animate-pulse w-full"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="sm:w-full sm:max-w-sm sm:mx-auto flex flex-col items-center">
              <BookOpenIcon className="h-10 w-10 text-indigo-500" />
              <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-white">
                Compartilhar um livro
              </h2>

              <div className="mt-8 rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-4">
                <label className="block text-sm font-medium text-indigo-300">
                  ISBN do Livro
                </label>

                <input
                  type="text"
                  required
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  onBlur={preencherDadosLivro}
                  placeholder="9788532530783"
                  className="mt-2 block w-full rounded-md bg-white/5 px-3 py-2 text-white outline-none ring-1 ring-white/10 focus:ring-indigo-500"
                />

                {loadingISBN && (
                  <p className="mt-2 text-xs text-indigo-400">
                    Buscando informações do livro...
                  </p>
                )}

                {!loadingISBN && bookLoaded && (
                  <p className="mt-2 text-xs text-green-400">
                    ✓ Livro encontrado e preenchido automaticamente.
                  </p>
                )}
              </div>

              {isbn && (
                <div className="mt-6 flex justify-center">
                  <img
                    src={obterCapaPorIsbn(isbn)}
                    alt={title || "Capa do livro"}
                    className="w-32 rounded-lg shadow-lg border border-white/10"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/300x450?text=Sem+Capa";
                    }}
                  />
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="mt-6 rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20 animate-pulse">
                <span className="font-semibold">Erro:</span> {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Título do Livro
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="block w-full rounded-md bg-white/5 px-3 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm"
                    placeholder="Ex: O Senhor dos Anéis"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Autor
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="block w-full rounded-md bg-white/5 px-3 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm"
                    placeholder="Ex: J.R.R. Tolkien"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200">
                    Gênero
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      required
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="block w-full rounded-md bg-white/5 px-3 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm"
                      placeholder="Ex: Fantasia"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200">
                    Data de Publicação
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      required
                      value={pubDateHTML}
                      onChange={(e) => setPubDateHTML(e.target.value)}
                      className="block w-full rounded-md bg-white/5 px-3 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm dark:[color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Descrição / Estado do Livro (Opcional)
                </label>
                <div className="mt-1">
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="block w-full rounded-md bg-white/5 px-3 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm resize-none"
                    placeholder="Fale um pouco sobre o estado de conservação do livro..."
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {isLoading ? "Enviando..." : "Cadastrar Livro"}
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-gray-400">
              Mudou de ideia?{" "}
              <button
                onClick={() => navigate("/")}
                className="font-semibold text-indigo-400 hover:text-indigo-300 focus:outline-none"
              >
                Voltar para a Home
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};
