import { useEffect, useState } from "react";
import BookCard from "./BookCard";
import { getBooks } from "../services/bookService";
import type { Book } from "../types/book";
import { BookOpenIcon } from "@heroicons/react/24/outline";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";


import "swiper/css";
import "swiper/css/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AvailableBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBooks() {
      try {
        const data = await getBooks();
        const availableBooks = data
          .filter((book) => book.status === "AVAILABLE")
          .slice(0, 5);
        setBooks(availableBooks);
      } catch (error) {
        console.error("Erro ao carregar livros:", error);
      } finally {
        setLoading(false);
      }
    }
    loadBooks();
  }, []);
if (loading) {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6 flex flex-col items-center">
        <BookOpenIcon className="h-16 w-16 text-indigo-600 animate-bounce" />

        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Buscando livros disponíveis...
        </p>
      </div>
    </section>
  );
}

  return (
    <section id="livros-disponiveis" className="relative bg-gray-900 py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Livros Disponíveis
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
            Descubra livros compartilhados pela comunidade e encontre sua próxima leitura.
          </p>
        </div>


        {books.length > 0 ? (
          <div className="relative px-12"> 
            

            <button className="btn-prev-custom absolute top-1/2 left-0 z-10 -translate-y-1/2 rounded-full bg-indigo-600 p-2 text-white shadow-lg transition hover:bg-indigo-500 disabled:opacity-40">
              <ChevronLeft className="h-6 w-6" />
            </button>

  
            <button className="btn-next-custom absolute top-1/2 right-0 z-10 -translate-y-1/2 rounded-full bg-indigo-600 p-2 text-white shadow-lg transition hover:bg-indigo-500 disabled:opacity-40">
              <ChevronRight className="h-6 w-6" />
            </button>

            <Swiper
              modules={[Navigation, Pagination]}

              navigation={{
                prevEl: ".btn-prev-custom",
                nextEl: ".btn-next-custom",
              }}
              pagination={{ clickable: true }}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 3 },
              }}
              className="!pb-14"
            >
              {books.map((book) => (
                <SwiperSlide key={book.id} className="h-auto">
                  <BookCard
                    id={book.id}
                    title={book.title}
                    author={book.author}
                    genre={book.genre}
                    owner={book.user.name}
                    isbn={book.isbn}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <p className="text-center text-gray-400">Nenhum livro disponível.</p>
        )}

        <div className="mt-4 text-center">
          <button className="rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white shadow-sm transition hover:bg-indigo-500">
            Ver catálogo completo →
          </button>
        </div>
      </div>
    </section>
  );
}
