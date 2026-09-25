# API specifications

## Responsibility split

- Person A: articles
- Person B: comments

## Endpoints

### Person A: articles

- `GET /articles`
  - Returns `200` with a JSON array of all articles.
- `POST /articles`
  - Accepts JSON `{ "title": string, "content": string, "date": string, "author": string }`.
  - Returns `201` with the created article, including a generated UUID `id`.
  - Returns `400` when a required field is missing.

### Person B: comments

- `GET /articles/:articleId/comments`
  - Returns `200` with a JSON array of comments belonging to the article.
  - Returns `404` when the article does not exist.
- `POST /articles/:articleId/comments`
  - Accepts JSON `{ "content": string, "author": string }`.
  - Returns `201` with the created comment, including a generated UUID `id`, a timestamp, and the article ID.
  - Returns `404` when the article does not exist.
  - Returns `400` when a required field is missing.

## Shared HTTP behavior

- Request bodies use `Content-Type: application/json`.
- Successful responses are JSON.
- Data is stored in the in-memory database from `db.js`.
