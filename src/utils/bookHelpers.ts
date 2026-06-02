export const CAPA_PADRAO = "https://placehold.co/300x450?text=Sem+Capa";

export function obterCapaPorIsbn(isbn: string | undefined | null): string {
  if (!isbn) return CAPA_PADRAO;

  const isbnLimpo = isbn.replace(/\D/g, "");

  if (isbnLimpo.length < 10) return CAPA_PADRAO;

  return `https://covers.openlibrary.org/b/isbn/${isbnLimpo}-L.jpg`;
}

export function formatarDataParaBR(dateHTML: string): string {
  if (!dateHTML) return "";

  const [ano, mes, dia] = dateHTML.split("-");

  return `${dia}/${mes}/${ano}`;
}

export async function buscarLivroPorISBN(isbn: string) {
  const isbnLimpo = isbn.replace(/\D/g, "");

  const response = await fetch(
    `https://openlibrary.org/search.json?isbn=${isbnLimpo}`
  );

  if (!response.ok) {
    throw new Error("Erro ao consultar Open Library");
  }

  const data = await response.json();

  if (!data.docs || data.docs.length === 0) {
    throw new Error("Livro não encontrado");
  }

  const livro = data.docs[0];

  return {
    title: livro.title || "",
    author: livro.author_name?.join(", ") || "",
    genre: livro.subject?.[0] || "",
    publishedDate: livro.first_publish_year
      ? `${livro.first_publish_year}-01-01`
      : "",
    description: "",
  };
}