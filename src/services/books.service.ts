import type { Book, CreateBook, UpdateBook } from "../models/book.js";

const books = new Map<number, Book>();
let nextBookId = 1;

export function listBooks(): Book[] {
  return Array.from(books.values());
}

export function getBook(id: number): Book | undefined {
  return books.get(id);
}

export function createBook(input: CreateBook): Book {
  if (!Number.isSafeInteger(nextBookId)) {
    throw new Error("Book ID limit reached");
  }

  const book: Book = { ...input, id: nextBookId };
  books.set(book.id, book);
  nextBookId += 1;
  return book;
}

export function updateBook(id: number, input: UpdateBook): Book | undefined {
  const book = getBook(id);
  if (!book) return undefined;

  const updated: Book = {
    id,
    title: input.title ?? book.title,
    author: input.author ?? book.author,
    genre: input.genre ?? book.genre,
    available: input.available ?? book.available,
  };
  books.set(id, updated);
  return updated;
}

export function deleteBook(id: number): boolean {
  return books.delete(id);
}
