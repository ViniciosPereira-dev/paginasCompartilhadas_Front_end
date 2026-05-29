export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  isbn: string;
  publicationDate: string;
  description?: string;
  status: string;

  userId: number;

  user: {
    name: string;
    phone: string;
  };

  createdAt: string;
}

export interface CriarLivroInput {
  title: string;
  author: string;
  genre: string;
  isbn: string;
  publicationDate: string; 
  description?: string;     
  status: "AVAILABLE";
}

export interface SurpreendaMeResponse {
  message: string;
  book: {
    id: number;
    title: string;
    author: string;
    genre: string;
    isbn?: string;
    description?: string;
    status: string;
  } | null;
  owner?: {
    id: number;
    name: string;
    phone?: string;
  };
}

