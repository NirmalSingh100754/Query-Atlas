import "dotenv/config";
import { Worker } from "bullmq";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";import { QdrantVectorStore } from "@langchain/qdrant";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "@langchain/textsplitters";

const worker = new Worker("file-upload-queue", async (job) => {
    console.log(`Job:`, job.data);
    const data = JSON.parse(job.data);

    // Load PDF
    const loader = new PDFLoader(data.path);
    const docs = await loader.load();

    // Split into chunks (IMPORTANT for embeddings quality)
    const textSplitter = new CharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 50,
    });

    const chunks = await textSplitter.splitDocuments(docs);
    console.log(`Chunks created: ${chunks.length}`);

    const embeddings = new HuggingFaceInferenceEmbeddings({
    apiKey: process.env.HF_API_KEY, // get from Hugging Face
    model: "BAAI/bge-base-en-v1.5",
});

    // Connect Qdrant
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings,
        {
            url: "http://localhost:6333",
            collectionName: "pdf_chunks",
        }
    );

    // Store embeddings
    await vectorStore.addDocuments(chunks);

    console.log(`✅ BGE embeddings stored in Qdrant!`);
},
{
    concurrency: 100,
    connection: {
        host: "localhost",
        port: 6379,
    }
});