import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import type { ApiResponse } from "../types/api";
import BookCard from "../components/BookCard";

interface BookFromAPI {
  id: number;
  title: string;
  author: string;
  genre: string;
  isbn: string;
  userId: number; 
  user?: {
    name: string;
  };
}

export const MyLibrary: React.FC = () => {
  const { idUsuario, nomeUsuario } = useAuth();
  
  const [myBooks, setMyBooks] = useState<BookFromAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Transformamos a lógica de busca em uma função isolada para podermos chamá-la de novo após deletar um livro
  const carregarMeusLivros = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<ApiResponse<BookFromAPI[]>>("/books");

      if (response.data.success) {
        const todosOsLivros = response.data.data;
        const livrosDoUsuario = todosOsLivros.filter(
          (book) => book.userId === idUsuario
        );
        setMyBooks(livrosDoUsuario);
      }
    } catch (error: any) {
      console.error("Erro ao carregar acervo:", error);
      setErrorMessage("Não foi possível carregar a sua biblioteca.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (idUsuario) {
      carregarMeusLivros();
    }
  }, [idUsuario]);

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Cabeçalho */}
        <div className="border-b border-white/10 pb-5 sm:flex sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Minha Biblioteca
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Gerencie o acervo de livros que você disponibilizou para a comunidade.
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-6 rounded-md bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20">
            {errorMessage}
          </div>
        )}

        {isLoading ? (
          <div className="mt-12 flex flex-col items-center justify-center space-y-4">
            <svg className="h-8 w-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-sm text-gray-400">Buscando seus livros cadastrados...</p>
          </div>
        ) : (
          <div className="mt-8">
            {myBooks.length === 0 ? (
              <div className="text-center rounded-2xl border-2 border-dashed border-white/10 py-12 px-4">
                <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3 className="mt-2 text-sm font-semibold text-white">Nenhum livro cadastrado</h3>
                <p className="mt-1 text-sm text-gray-400">Você ainda não compartilhou nenhum livro na plataforma.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {myBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    id={book.id} // INJETANDO O ID DO LIVRO
                    title={book.title}
                    author={book.author}
                    genre={book.genre}
                    isbn={book.isbn}
                    owner={nomeUsuario || "Eu"}
                    isOwner={true} // ATIVANDO A FLAG PARA FAZER APARECER EDITAR/EXCLUIR
                    onDeleteSuccess={carregarMeusLivros} // FAZ A TELA RECARREGAR AUTOMATICAMENTE AO EXCLUIR
                  />
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
