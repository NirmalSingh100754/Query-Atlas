# Query Atlas

Query Atlas is a full-stack proof-of-concept for document ingestion, file upload, and Retrieval-Augmented Generation (RAG) retrieval. It combines a Next.js client UI with an Express backend, background processing via BullMQ workers, and Qdrant vector search for chunk retrieval.

## What this project contains

- `client/` – A Next.js frontend application.
  - `app/page.tsx` renders the upload screen.
  - `app/components/file-upload.tsx` provides PDF upload UX and sends files to the backend.
- `server/` – An Express backend.
  - `server/index.js` exposes health, file upload, and chat retrieval endpoints.
  - `server/worker.js` processes uploaded PDFs, creates chunks, generates embeddings, and stores vectors in Qdrant.
  - Multer stores uploaded files in `server/uploads/` using a unique timestamped filename.
- `docker-compose.yml` – Docker Compose configuration for containerized services.
  - Valkey (in-memory data store) for caching and session management, exposed on port 6379.

## Current functionality

- The frontend accepts a single `.pdf` file via a clickable upload button.
- The uploaded file is sent as `multipart/form-data` to `http://localhost:8000/upload`.
- The backend stores incoming PDFs in `server/uploads/` and enqueues a BullMQ job.
- The worker loads each PDF, splits it into chunks, generates embeddings with Hugging Face, and uploads vectors to Qdrant collection `pdf_chunks`.
- The backend exposes:
  - `GET /` health route.
  - `POST /upload` file upload route.
  - `POST /chat` semantic retrieval route that returns top matching chunks from Qdrant.

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
- Uses `bullmq` for job queue management with Valkey/Redis as the queue broker.
- Connects to Valkey (in-memory store) on port 6379 for caching and job persistence.
- Uses LangChain integrations with:
  - `@langchain/community` for Hugging Face embeddings and PDF loading.
  - `@langchain/qdrant` for vector similarity search.
- Uses Qdrant on port 6333 with collection `pdf_chunks`.
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

### How this project currently implements RAG retrieval

- Uploaded PDFs are parsed and split into chunks in `server/worker.js`.
- Chunks are embedded with the Hugging Face model `BAAI/bge-base-en-v1.5`.
- Embeddings are stored in Qdrant collection `pdf_chunks`.
- `POST /chat` retrieves top-k (`k=5`) matching chunks using vector similarity search.
- The generation layer (LLM answer synthesis) can be added on top of the retrieved chunk context.

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

### Docker services

```bash
docker-compose up
```

This starts the Valkey service on port 6379, which is required by the backend for job queuing.

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

## API reference

### `GET /`

Returns server health status.

### `POST /upload`

Accepts one file field:
- `pdf` (multipart file)

Behavior:
- stores file in `server/uploads/`
- enqueues processing job to `file-upload-queue`

### `POST /chat`

Request body:

```json
{
  "query": "What are the key points from the uploaded PDF?"
}
```

Notes:
- If `query` is missing or empty, a default query is used.
- Returns matched chunks from Qdrant with content and metadata.

## Required environment variables

In `server/.env`:

- `HF_API_KEY` – Hugging Face API key used for embedding generation and retrieval queries.

## Recommended next steps

- add answer generation (LLM) on top of retrieved chunks from `/chat`
- add source-aware response formatting (page/file references)
- add chat/search UI in frontend to call `/chat`
- add stronger upload validation and file type checks
- add retry/error handling and monitoring for worker jobs

## File structure

- `client/` – Next.js app
  - `app/` – frontend pages and components
  - `components/file-upload.tsx` – upload component
- `server/` – backend server
  - `index.js` – Express server and API routes (`/`, `/upload`, `/chat`)
  - `worker.js` – BullMQ worker for PDF chunking + embeddings + Qdrant insertion
  - `uploads/` – stored PDF uploads

## Notes

This repository currently implements upload + background processing + vector ingestion + semantic retrieval. It does not yet generate final natural-language answers from retrieved chunks, but the retrieval pipeline is active and ready for that layer.
