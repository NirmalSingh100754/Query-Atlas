import cors from "cors";
import express from "express";
import multer from "multer";
import {Queue} from "bullmq";
import "dotenv/config";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { QdrantVectorStore } from "@langchain/qdrant";

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
    const defaultQuery = "what is reinforcement learning";
    const userQuery = req.query?.query?.trim() || defaultQuery;

    const embeddings = new HuggingFaceInferenceEmbeddings({
      apiKey: process.env.HF_API_KEY,
      model: "BAAI/bge-base-en-v1.5",
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: "http://localhost:6333",
        collectionName: "pdf_chunks",
      }
    );

    const retriever = vectorStore.asRetriever({
      k: 5,
    });

    const results = await retriever.invoke(userQuery);

    return res.json({
      status: "success",
      query: userQuery,
      matches: results.map((doc, index) => ({
        id: index + 1,
        content: doc.pageContent,
        metadata: doc.metadata,
      })),
    });
  } catch (error) {
    console.error("Error fetching chat results from Qdrant:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch data from Qdrant.",
    });
  }
});

app.listen(8000, () => console.log("Server is running on port 8000"));
