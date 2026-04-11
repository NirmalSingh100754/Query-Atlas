# Query Atlas

A full-stack document upload UI built with a Next.js client and an Express server.

## Overview

- `client/` contains the Next.js frontend.
- `server/` contains the Express backend.

## Features

- PDF file upload UI with modern dark styling.
- Simple split layout for uploading and previewing documents.
- Tailwind CSS styling in the client.

## Local setup

### Client

```bash
cd client
pnpm install
pnpm dev
```

Open `http://localhost:3000` to view the client.

### Server

```bash
cd server
pnpm install
```

The server is currently a basic Express setup and can be extended for API routes.

## Notes

- The client uses Next.js 16 and React 19.
- The server uses Express 4.
- Add backend endpoints in `server/` and connect them with client requests as needed.
