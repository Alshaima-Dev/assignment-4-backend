import type { RequestHandler } from "express";
import { ApiError } from "../middleware/error-handler.js";
import { bookIdSchema, createBookSchema, updateBookSchema } from "../models/book.js";
import * as booksService from "../services/books.service.js";

export const listBooks: RequestHandler = (_request, response) => {
  response.json(booksService.listBooks());
};

export const getBook: RequestHandler = (request, response) => {
  const id = bookIdSchema.parse(request.params.id);
  const book = booksService.getBook(id);
  if (!book) throw new ApiError(404, "Book not found");

  response.json(book);
};

export const createBook: RequestHandler = (request, response) => {
  const input = createBookSchema.parse(request.body);
  const book = booksService.createBook(input);
  response.location(`/api/books/${book.id}`).status(201).json(book);
};

export const updateBook: RequestHandler = (request, response) => {
  const id = bookIdSchema.parse(request.params.id);
  const input = updateBookSchema.parse(request.body);
  const book = booksService.updateBook(id, input);
  if (!book) throw new ApiError(404, "Book not found");

  response.json(book);
};

export const deleteBook: RequestHandler = (request, response) => {
  const id = bookIdSchema.parse(request.params.id);
  if (!booksService.deleteBook(id)) throw new ApiError(404, "Book not found");

  response.status(204).end();
};
