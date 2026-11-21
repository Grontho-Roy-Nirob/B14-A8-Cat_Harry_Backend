# AGENTS.md

## Run / verify
- `npm start` runs `node index.js`; `npm run dev` runs `nodemon index.js`. There is no lint, build, or typecheck config.
- `npm test` is a placeholder that always exits 1 (`echo "Error: no test specified"`). There is no test suite; don't treat it as a regression.

## Runtime wiring
- ESM project (`"type": "module"`): use `import`/`export`. `index.js` is the only entrypoint; it default-exports `app` and named-exports `connectToMongoDB()`.
- `index.js` connects to MongoDB via top-level `await` **and** calls `app.listen()` at import time. Importing `app` from another script requires a working `MONGODB_URI` and starts a server on port 8000; there is no lazy connection or `import.meta.main` guard.
- Native `mongodb` driver (no Mongoose). Database `studiospace` and collections `studios`, `bookings` are referenced in `index.js`; `ObjectId` is already imported.
- Handlers are intentionally thin: they pass `req.body` straight to MongoDB and use `new ObjectId(id)` inline. Don't add validation/normalization helpers or error middleware.
- Routes are root-level (no `/api` prefix): `POST /add-studio`, `GET /studios`, `GET /featured-studios`, `GET /my-listings/:email`, `GET|PATCH|DELETE /studio/:id`, `POST /booking`, `GET /my-bookings/:email`, `PATCH|DELETE /my-bookings/:id`.
- JWT auth is intentionally absent. `my-listings` filters by `ownerEmail` from the URL; bookings filter by `email` from the URL. Cancel by PATCHing `{ "status": "Cancelled" }` to `/my-bookings/:id`.

## Environment quirks
- `.env` exists locally (gitignored) and already holds the Atlas URI — never commit it or inline credentials in source.
- Image URLs are supplied by the frontend and stored as-is; there is no backend image-upload endpoint.
- `PORT`, `DB_NAME`, and `FRONTEND_URL` in `.env` are unused: port and db name are hardcoded in `index.js`, and CORS is wide open (`app.use(cors())`).
- `dotenv/config` is imported at the top of `index.js`; don't add a redundant `dotenv.config()` there.
