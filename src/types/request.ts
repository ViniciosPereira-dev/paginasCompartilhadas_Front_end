export interface RequestModel {
  id: number;
  bookId: number;
  userId: number;
  status: string;

  book: {
    id: number;
    title: string;
    author: string;
    genre: string;
    userId: number;
  };

  user: {
    id: number;
    name: string;
    phone?: string;
  };
}