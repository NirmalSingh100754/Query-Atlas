# Query Atlas

A full-stack project with a Next.js frontend and Express backend.

## Notes from today

- Created the `server/` folder and initialized an Express backend.
- Added a basic server entrypoint in `server/index.js`.
- Fixed server startup issues by importing `cors` and enabling ES module support.
- Added a `server/.gitignore` file with standard Node and environment ignores.
- Built the Next.js frontend in `client/` with a document upload UI.
- Created the upload component in `client/app/components/file-upload.tsx`.
- Improved UI styling in `client/app/page.tsx` and `client/app/globals.css`.
- Ensured the interface uses a dark theme with better contrast and polished cards.
- Confirmed local startup commands for both client and server.

## Commands used today

```bash
# Server setup and run
cd server
pnpm install
pnpm dev

# Client setup and run
cd ../client
pnpm install
pnpm dev

# Installed client icon library
pnpm install lucide-react

# Installed typing support for Express
cd ../server
pnpm i types/express@4.x -D
```

## Project structure

- `client/` – Next.js frontend using React, Tailwind CSS, and Lucide icons.
- `server/` – Express backend for future API routes.

## Setup

### Client

```bash
cd client
pnpm install
pnpm dev
```

Then open `http://localhost:3000`.

### Server

```bash
cd server
pnpm install
pnpm dev
```

The server listens on port `8000` by default.

## Current status

- Frontend UI is available and styled.
- Backend is a minimal Express server ready to add routes.
- Basic local startup workflow is documented.
- Fixed file upload storage in `server/index.js` so `multer` uses the configured `diskStorage` instead of default temporary destination behavior.
- Uploaded PDFs now keep their original `.pdf` extension and are stored in `server/uploads/` with a unique filename prefix.
- The current upload route is `POST /upload` and expects a form field named `pdf`.
- Next improvements: add file type validation, return the stored file path or metadata in the upload response, and build backend routes for PDF processing/search.
