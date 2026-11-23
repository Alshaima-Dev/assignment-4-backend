import express from "express";
import { ApiError, errorHandler } from "./middleware/error-handler.js";
import booksRouter from "./routes/books.routes.js";

const app = express();

app.use(express.json());

app.get("/health", (_request, response) => {
  response.status(200).json({ status: "ok" });
});

app.use("/api/books", booksRouter);

app.use((_request, _response, next) => {
  next(new ApiError(404, "Route not found"));
});
app.use(errorHandler);

export default app;
