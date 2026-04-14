# Query Atlas

Query Atlas is a full-stack proof-of-concept for document ingestion, file upload, and the foundations of a Retrieval-Augmented Generation (RAG) search workflow. It combines a Next.js client UI with an Express backend for file handling today, and is designed to evolve into a vector-enabled search + answer system.

## What this project contains

- `client/` – A Next.js frontend application.
  - `app/page.tsx` renders the upload screen.
  - `app/components/file-upload.tsx` provides PDF upload UX and sends files to the backend.
- `server/` – An Express backend.
  - `server/index.js` exposes a health route and a file upload endpoint.
  - Multer stores uploaded files in `server/uploads/` using a unique timestamped filename.

## Current functionality

- The frontend accepts a single `.pdf` file via a clickable upload button.
- The uploaded file is sent as `multipart/form-data` to `http://localhost:8000/upload`.
- The backend stores incoming PDFs in `server/uploads/`.
- The backend also exposes a simple `/` health route that returns a JSON status message.

## Project architecture

### Frontend

- Built with Next.js App Router.
- Uses React client components for file upload behavior.
- Uses `lucide-react` for icons.
- Currently implements only the upload interface and no search or chat UI yet.

### Backend

- Built with Express.js.
- Uses `cors` to allow browser requests from the local client.
- Uses `multer` for file upload handling and persistent storage to disk.
- Listens on port `8000` by default.

## How RAG fits in this project

This project is intended to grow into a RAG-enabled document search application. The current upload flow is the first stage in that pipeline.

### What is RAG?

Retrieval-Augmented Generation (RAG) is a pattern where a model answers queries by retrieving relevant documents from a corpus, then generating responses based on those documents. The key steps are:

1. ingest documents
2. split them into chunks
3. convert chunks into vector embeddings
4. store embeddings in a vector database
5. perform similarity search for query-relevant chunks
6. use the retrieved context with a language model to generate answers

### How this project can evolve into RAG

- Uploaded PDFs can be parsed and split into text chunks.
- Each chunk can be embedded using an embedding model (OpenAI, Cohere, etc.).
- The resulting vectors can be stored in a vector database for fast similarity search.
- A query API can retrieve the top-k matching chunks and forward them to a generative model.

## Vector database notes

A vector database is the central store for embeddings in a RAG system. It allows similarity search over high-dimensional vectors instead of raw text.

Common vector database options include:

- FAISS (local, in-memory / disk-backed)
- Pinecone (managed service)
- Weaviate (open source with REST API)
- Milvus (open source, scalable)
- Supabase Vector DB / Postgres + pgvector
- Redis with vector similarity support

### Role of the vector database here

- Store embedding vectors for document chunks.
- Support fast nearest-neighbor search for query embeddings.
- Return relevant document references or text snippets for the RAG prompt.

## Setup and run

### Server

```bash
cd server
pnpm install
pnpm dev
```

The server listens on `http://localhost:8000`.

### Client

```bash
cd client
pnpm install
pnpm dev
```

Then open `http://localhost:3000`.

## Recommended next steps

- add PDF parsing and chunking logic in the backend
- generate embeddings for document text
- integrate a vector database for semantic search
- build a query API that returns relevant chunks
- add a chat/search UI in the frontend for user queries
- add file validation and upload response metadata

## File structure

- `client/` – Next.js app
  - `app/` – frontend pages and components
  - `components/file-upload.tsx` – upload component
- `server/` – backend server
  - `index.js` – Express server and upload route
  - `uploads/` – stored PDF uploads

## Notes

This repository currently implements the upload scaffold and documents the intended RAG/vector workflow. The actual vector embedding and semantic search layers are not yet implemented, but the project is structured to support them next.
