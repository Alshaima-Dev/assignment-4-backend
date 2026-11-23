# Library Book Management API

This REST API manages a library's book list and tracks whether each book is available. It supports four CRUD operations (Create, Read, Update, and Delete) through five API endpoints. Read uses two endpoints, one to list all books and one to get a single book.

## Technologies

| Technology | Role |
| --- | --- |
| Node.js and npm | Run the server and manage project dependencies. |
| Express 5 | Defines HTTP Routes and runs Middleware. |
| TypeScript | Checks types in strict mode. The `NodeNext` setting tells TypeScript to follow Node.js rules for ES Modules (`import` and `export`). |
| Zod | Handles Validation by checking request data before it reaches the Service. |
| tsx | Runs TypeScript directly and restarts the development server when files change. |

## Getting started

Install Node.js and npm, then run these commands from the project folder.

```sh
npm ci
npm run dev
```

The server uses `http://localhost:3000` by default. Set the `PORT` environment variable to use a different port. To check whether the server is running, send `GET /health`. It returns `200 OK` with `{"status":"ok"}`.

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the development server with automatic restarts. |
| `npm run typecheck` | Checks TypeScript types without writing build files. |
| `npm run build` | Compiles the project into `dist/`. |
| `npm start` | Runs the compiled server after a build. |

## Folder structure

```text
src/
  app.ts                           Sets up Express, Middleware, and Routes
  server.ts                        Starts the server
  routes/books.routes.ts           Connects HTTP methods and paths to Controllers
  controllers/books.controller.ts Validates requests, calls the Service, and sends responses
  services/books.service.ts       Assigns IDs and manages the book collection
  models/book.ts                   Defines Book types and Zod Validation rules
  middleware/error-handler.ts      Sends JSON error responses from one place
```

A Route selects a Controller based on the HTTP method and URL. The Controller checks the input, calls the Service, and sends the result. Middleware handles shared work such as reading JSON request bodies and formatting errors.

## Book model and storage

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | Number | Unique positive whole number assigned by the server. |
| `title` | String | Book title. |
| `author` | String | Author's name. |
| `genre` | String | Book category. |
| `available` | Boolean | `true` if the book is available and `false` otherwise. |

IDs start at `1` and increase by one for every new book. Deleting book `3` after creating books `1`, `2`, and `3` means the next book gets ID `4`.

The Service uses a JavaScript `Map` to store and find books by ID. The books stay in memory while the server runs. A restart clears the books and resets the next ID to `1`.

## Book endpoints

Replace `:id` with a book's numeric ID, such as `1`.

| Method | Path | Success response |
| --- | --- | --- |
| GET | `/api/books` | `200 OK` with a JSON array. An empty collection returns `[]`. |
| GET | `/api/books/:id` | `200 OK` with one book. |
| POST | `/api/books` | `201 Created` with the new book and a `Location` header that tells you where to find it, such as `/api/books/1`. |
| PATCH | `/api/books/:id` | `200 OK` with the updated book. |
| DELETE | `/api/books/:id` | `204 No Content` with an empty response body. |

### Create a book

Send `POST /api/books` with the header `Content-Type: application/json` and this JSON body.

```json
{
  "title": "The Hobbit",
  "author": "J. R. R. Tolkien",
  "genre": "Fantasy",
  "available": true
}
```

### Update a book

Send `PATCH /api/books/1` with the same header. Use the ID returned by POST if your book has a different ID. This example changes only `available`.

```json
{
  "available": false
}
```

## Validation and errors

- POST requires all four editable fields. PATCH requires at least one editable field and keeps the other fields as they are.
- Zod trims spaces from `title`, `author`, and `genre` and rejects blank values. `available` must be a JSON boolean (`true` or `false`).
- POST and PATCH reject extra fields, including `id`.
- An ID in the URL must contain digits and represent a positive whole number that JavaScript can store exactly. Values such as `0`, `-1`, and `1.5` fail Validation.

| Status | When it happens |
| --- | --- |
| `400 Bad Request` | The ID or request body is invalid, including malformed JSON. |
| `404 Not Found` | A book with the given ID does not exist, or the route is unknown. |
| `500 Internal Server Error` | An unexpected error occurs. The server logs the error and sends a general message. |

Errors include an `error.message` field. Zod Validation errors also include `error.details` with the location and message for each issue. A missing book returns this response body.

```json
{
  "error": {
    "message": "Book not found"
  }
}
```

## Codex use and project checks

Codex helped organize the project into layers, implement CRUD and Validation, and switch the API to sequential numeric IDs. Codex reviewed the source and npm scripts while writing this README.

Codex ran the TypeScript type check, production build, and automated HTTP checks against the compiled app. The HTTP checks covered all five Book endpoints, the health route, and invalid requests or missing books. They also confirmed that the API assigned ID `4` after book `3` was deleted.

I also sent API requests manually in Postman to check the responses.
