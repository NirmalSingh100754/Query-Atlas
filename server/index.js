import cors from "cors";
import express from "express";
import multer from "multer";
import {Queue} from "bullmq";
import "dotenv/config";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { HuggingFaceInference } from "@langchain/community/llms/hf";
import { QdrantVectorStore } from "@langchain/qdrant";


const llm = new HuggingFaceInference({
  apiKey: process.env.HF_API_KEY,
  model: "Qwen/Qwen2.5-7B-Instruct",
  temperature: 0,
  maxNewTokens: 120,
  provider: "together",
  together: {
    apiKey: process.env.TOGETHER_API_KEY,
  },
});

const embeddings = new HuggingFaceInferenceEmbeddings({
  apiKey: process.env.HF_API_KEY,
  model: "BAAI/bge-base-en-v1.5",
});

let retrieverPromise;
const answerCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

const withTimeout = (promise, timeoutMs, timeoutMessage) =>
  Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
    }),
  ]);

const getRetriever = async () => {
  if (!retrieverPromise) {
    retrieverPromise = QdrantVectorStore.fromExistingCollection(embeddings, {
      url: "http://localhost:6333",
      collectionName: "pdf_chunks",
    }).then((vectorStore) => vectorStore.asRetriever({ k: 3 }));
  }
  return retrieverPromise;
};


const queue = new Queue("file-upload-queue", {
    connection: {
        host: "localhost",
        port: 6379,
    }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
})


const upload = multer({ storage });
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({
    message: "Hello from the server",
    status: "success",
  });
});

app.post("/upload", upload.single("pdf"), (req, res) => {
  queue.add('file-ready', JSON.stringify({
    filename: req.file.filename,
    source: req.file.destination,
    path: req.file.path,
  }))
  return res.json({
    message: "File uploaded successfully",
    status: "success",
  });
});

app.get("/chat", async (req, res) => {
  try {
    const defaultQuery = "What are the key points from the uploaded PDF?";
    const userQuery = req.query?.query?.trim() || defaultQuery;
    const cacheKey = userQuery.toLowerCase();
    const cached = answerCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return res.type("text/plain").send(cached.answer);
    }

    const retriever = await withTimeout(
      getRetriever(),
      10_000,
      "Retriever initialization timed out."
    );
    const results = await withTimeout(
      retriever.invoke(userQuery),
      15_000,
      "Retrieval timed out."
    );

    if (!results.length) {
      return res
        .type("text/plain")
        .send("I could not find relevant context in uploaded documents.");
    }

    const context = results
      .map((doc, index) => {
        const compact = (doc.pageContent || "").replace(/\s+/g, " ").slice(0, 450);
        return `Chunk ${index + 1}:\n${compact}`;
      })
      .join("\n\n");

    const prompt = `
You are a helpful assistant that answers questions using only the provided context from uploaded PDFs.
If the context is not enough, say you do not have enough information from the uploaded documents.

Question:
${userQuery}

Context:
${context}

Answer:
`;

    let answerText = "";
    try {
      const answer = await withTimeout(
        llm.invoke(prompt),
        8_000,
        "Generation timed out."
      );
      answerText = typeof answer === "string" ? answer.trim() : String(answer ?? "").trim();
    } catch (generationError) {
      console.error("LLM generation failed, using fallback answer:", generationError.message);
    }

    if (!answerText) {
      const fallbackContext = results
        .slice(0, 2)
        .map((doc) => doc.pageContent?.trim())
        .filter(Boolean)
        .join(" ");

      const compactFallback = fallbackContext.replace(/\s+/g, " ").slice(0, 1000);
      answerText = compactFallback
        ? `Based on retrieved documents: ${compactFallback}`
        : "I could not generate an answer from the retrieved context.";
    }

    answerCache.set(cacheKey, { answer: answerText, timestamp: Date.now() });
    return res.type("text/plain").send(answerText);
  } catch (error) {
    console.error("Error fetching chat results from Qdrant:", error);
    return res
      .status(500)
      .type("text/plain")
      .send(`Failed to generate answer: ${error.message}`);
  }
});

app.listen(8000, () => console.log("Server is running on port 8000"));
