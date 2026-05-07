# Query Atlas

Query Atlas is a full-stack PDF Q&A app. It combines a Next.js frontend with Clerk auth, an Express backend, BullMQ worker-based ingestion, and Qdrant retrieval to support RAG-style answers over uploaded documents.

## What this project contains

- `client/` - Next.js frontend app.
  - `app/layout.tsx` - Header + auth actions and signed-in/signed-out views.
  - `app/page.tsx` - Two-panel screen (upload + chat area) below header.
  - `app/components/file-upload.tsx` - PDF upload UI that posts to backend.
  - `app/components/chat.tsx` - Multi-turn chat UI (user/assistant message history).
- `server/` - Express backend.
  - `server/index.js` - Health, upload, and chat answer endpoints.
  - `server/worker.js` - PDF parsing/chunking/embedding + Qdrant ingestion.
  - `server/uploads/` - Uploaded PDFs stored via Multer.
- `docker-compose.yml` - Local Valkey service for BullMQ.

## Current functionality

- Clerk-based sign in/sign up/sign out in the header.
- Upload a PDF from the left panel (`POST /upload`).
- Worker processes uploaded PDFs and stores embeddings in Qdrant (`pdf_chunks`).
- Ask questions in the chat panel on the right.
- Chat keeps conversation history in the UI (messages append in order).
- Backend retrieves relevant chunks and generates an answer.
- If generation fails/times out, backend returns a cleaned fallback answer from retrieved context.

## Project architecture

### Frontend

- Built with Next.js App Router + React client components.
- Uses Clerk for auth UI states.
- Uses shadcn UI components (`Input`, `Button`) in chat/upload flows.
- Layout is structured as fixed header + content area below it to avoid overlap issues.
- Chat supports:
  - Enter key send
  - loading state while assistant responds
  - auto-scroll to latest message

### Backend

- Built with Express.js.
- Uses `cors`, `multer`, and `bullmq`.
- Uses LangChain + Hugging Face embeddings + Qdrant vector retrieval.
- Uses Hugging Face Inference LLM (`Qwen/Qwen2.5-7B-Instruct`, Together provider) for answer generation.
- Uses retrieval/generation timeouts with graceful fallback behavior.
- Runs on port `8000`.

## How RAG fits in this project

This app already implements a practical RAG pipeline for PDFs.

### What is RAG?

Retrieval-Augmented Generation (RAG) is a pattern where a model answers queries by retrieving relevant documents from a corpus, then generating responses based on those documents. The key steps are:

1. ingest documents
2. split them into chunks
3. convert chunks into vector embeddings
4. store embeddings in a vector database
5. perform similarity search for query-relevant chunks
6. use the retrieved context with a language model to generate answers

### How this project currently implements RAG

- Uploaded PDFs are parsed and split into chunks in `server/worker.js`.
- Chunks are embedded with the Hugging Face model `BAAI/bge-base-en-v1.5`.
- Embeddings are stored in Qdrant collection `pdf_chunks`.
- `GET /chat` retrieves top-k (`k=5`) matching chunks using vector similarity search.
- Retrieved context is used to prompt the LLM for final answer text.
- If LLM generation fails, a compact context-based fallback is returned.

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
- Return relevant context snippets for the RAG prompt.

## Setup and run

### Docker services

```bash
docker-compose up
```

This starts Valkey on port `6379` for BullMQ.

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

### `GET /chat`

Query params:

- `query` (string, optional)

Notes:
- If `query` is missing/empty, backend uses a default query.
- Response type is `text/plain` (assistant answer string).
- Internally performs retrieval + generation with timeout guards.

## Required environment variables

In `server/.env`:

- `HF_API_KEY` - used for embeddings and inference.
- `TOGETHER_API_KEY` - used by Together provider for LLM generation.

## Recommended next steps

- Add source citations (chunk/page metadata) in chat answers.
- Add streaming responses in chat UI.
- Add per-file filtering for retrieval (query within selected document).
- Add stronger upload validation + size limits + duplicate handling.
- Add retry/observability dashboards for worker and LLM calls.

## File structure

- `client/` - Next.js app
  - `app/layout.tsx` - global layout + auth header
  - `app/page.tsx` - upload/chat split layout
  - `app/components/file-upload.tsx` - upload UI
  - `app/components/chat.tsx` - multi-turn chat UI
- `server/` - backend API + worker
  - `index.js` - routes (`/`, `/upload`, `/chat`)
  - `worker.js` - ingestion/chunking/embeddings/Qdrant upsert
  - `uploads/` - stored PDFs

## Notes

This repository now supports end-to-end local flow: sign in, upload PDF, ask questions, and receive generated answers grounded in retrieved chunks.
