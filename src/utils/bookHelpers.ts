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
