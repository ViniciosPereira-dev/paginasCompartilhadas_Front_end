import React, { useEffect, useState } from "react";
import api from "../services/api";
import type { ApiResponse } from "../types/api";
import type { SurpreendaMeResponse } from "../types/book";
import BookCard from "../components/BookCard";
import { useAuth } from "../contexts/AuthContext";

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  isbn: string;
  status: string;
  userId: number;
  user?: {
    name: string;
  };
}

export const AvailableBooks: React.FC = () => {
   const { idUsuario } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroGenero, setFiltroGenero] = useState("");

  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 4;

  const [livroSorteado, setLivroSorteado] =
    useState<SurpreendaMeResponse | null>(null);

  const [isSorteando, setIsSorteando] = useState(false);

  useEffect(() => {
    const buscarLivros = async () => {
      try {
        setIsLoading(true);

        const response = await api.get<ApiResponse<Book[]>>("/books");

        if (response.data.success) {
          const disponiveis = response.data.data.filter(
            (book) => book.status === "AVAILABLE"
          );

          setBooks(disponiveis);
        }
      } catch (error) {
        console.error(error);
        setErrorMessage(
          "Não foi possível carregar os livros disponíveis."
        );
      } finally {
        setIsLoading(false);
      }
    };

    buscarLivros();
  }, []);

  const handleSurpreendaMe = async () => {
    try {
      setIsSorteando(true);
      setLivroSorteado(null);

      const params = filtroGenero
        ? { genre: filtroGenero }
        : {};

      const response = await api.get<SurpreendaMeResponse>(
        "/recommendation",
        { params }
      );

      setLivroSorteado(response.data);
    } catch (error) {
      console.error(error);
      alert("Erro ao buscar recomendação.");
    } finally {
      setIsSorteando(false);
    }
  };

  // ================= LÓGICA DE FILTRAGEM EM MEMÓRIA =================
  const livrosFiltrados = books.filter((book) => {
    // 1. REGRA DE OURO: Se o livro foi cadastrado por você, esconde do catálogo geral
    if (Number(book.userId) === Number(idUsuario)) {
      return false;
    }

    // 2. Mantém a busca por digitação de Título ou Autor
    const bateTexto =
      book.title
        .toLowerCase()
        .includes(filtroTexto.toLowerCase()) ||
      book.author
        .toLowerCase()
        .includes(filtroTexto.toLowerCase());

    // 3. Mantém o filtro por Gênero selecionado no select
    const bateGenero = filtroGenero
      ? book.genre.toLowerCase() ===
        filtroGenero.toLowerCase()
      : true;

    return bateTexto && bateGenero;
  });


  const indiceUltimoItem = paginaAtual * itensPorPagina;
  const indicePrimeiroItem =
    indiceUltimoItem - itensPorPagina;

  const livrosExibidosNaPagina =
    livrosFiltrados.slice(
      indicePrimeiroItem,
      indiceUltimoItem
    );

  const totalPaginas = Math.ceil(
    livrosFiltrados.length / itensPorPagina
  );

  useEffect(() => {
    setPaginaAtual(1);
  }, [filtroTexto, filtroGenero]);

  return (
    <div className="min-h-screen bg-gray-900 px-6 py-12 text-white lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">

        {/* Banner Surpreenda-me */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-950 p-8 shadow-2xl">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
              🎲 Recomendação Inteligente
            </span>

            <h2 className="text-3xl font-bold tracking-tight">
              Não sabe o que ler?
            </h2>

            <p className="text-sm text-gray-300">
              Nosso microsserviço escolhe um livro
              aleatório disponível para você.
            </p>

            <button
              onClick={handleSurpreendaMe}
              disabled={isSorteando}
              className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
            >
              {isSorteando
                ? "Sorteando..."
                : "🎲 Me surpreenda"}
            </button>
          </div>

          {livroSorteado?.book && (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-widest text-indigo-400">
                {livroSorteado.book.genre}
              </p>

              <h3 className="mt-2 text-xl font-bold">
                {livroSorteado.book.title}
              </h3>

              <p className="mt-1 text-sm text-gray-300">
                {livroSorteado.book.author}
              </p>

              {livroSorteado.owner && (
                <p className="mt-3 text-sm text-indigo-300">
                  👤 Doador:{" "}
                  {livroSorteado.owner.name}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Filtros */}
        <div className="rounded-2xl border border-white/5 bg-gray-800/50 p-6">
          <div className="flex flex-col gap-4 md:flex-row">

            <div className="flex-1">
              <label className="mb-2 block text-xs font-medium text-gray-400">
                Pesquisar
              </label>

              <input
                type="text"
                value={filtroTexto}
                onChange={(e) =>
                  setFiltroTexto(e.target.value)
                }
                placeholder="Título ou autor..."
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div className="md:w-64">
              <label className="mb-2 block text-xs font-medium text-gray-400">
                Gênero
              </label>

              <select
                value={filtroGenero}
                onChange={(e) =>
                  setFiltroGenero(e.target.value)
                }
                className="w-full rounded-lg border border-white/10 bg-gray-800 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
              >
                <option value="">Todos</option>
                <option value="Fantasia">
                  Fantasia
                </option>
                <option value="Suspense">
                  Suspense
                </option>
                <option value="Ficção">
                  Ficção
                </option>
                <option value="Aventura">
                  Aventura
                </option>
                <option value="Clássico">
                  Clássico
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-2xl font-bold">
              Livros Disponíveis
            </h3>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
            </div>
          ) : errorMessage ? (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
              {errorMessage}
            </div>
          ) : livrosExibidosNaPagina.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 py-20 text-center text-gray-400">
              Nenhum livro encontrado.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {livrosExibidosNaPagina.map((book) => (
                <BookCard
                  key={book.id}
                  id={book.id}
                  title={book.title}
                  author={book.author}
                  genre={book.genre}
                  isbn={book.isbn}
                  owner={
                    book.user?.name ||
                    "Doador Anônimo"
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* Paginação */}
        {!isLoading && totalPaginas > 1 && (
          <div className="flex items-center justify-between border-t border-white/10 pt-6">
            <p className="text-sm text-gray-400">
              Página {paginaAtual} de{" "}
              {totalPaginas}
            </p>

            <div className="flex gap-2">
              <button
                disabled={paginaAtual === 1}
                onClick={() =>
                  setPaginaAtual((prev) => prev - 1)
                }
                className="rounded-lg border border-white/10 bg-gray-800 px-4 py-2 text-sm text-white transition hover:bg-gray-700 disabled:opacity-30"
              >
                ◀ Anterior
              </button>

              <button
                disabled={
                  paginaAtual === totalPaginas
                }
                onClick={() =>
                  setPaginaAtual((prev) => prev + 1)
                }
                className="rounded-lg border border-white/10 bg-gray-800 px-4 py-2 text-sm text-white transition hover:bg-gray-700 disabled:opacity-30"
              >
                Próximo ▶
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};