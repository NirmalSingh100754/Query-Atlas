import "dotenv/config";
import { Worker } from "bullmq";
import { OpenAIEmbeddings } from '@langchain/openai';
import { QdrantVectorStore } from '@langchain/qdrant';
import { Document } from "@langchain/core/documents";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CharacterTextSplitter, TextSplitter } from "@langchain/textsplitters";


const worker = new Worker("file-upload-queue", async (job) => {
    console.log(`Job:`, job.data);
    const data = JSON.parse(job.data);
    /*
    path: data.path,
    read the pdf,
    chunk the pdf,
    call the open ai embedding model for every chunk,
    store the chunk in Qudrant DB.

    */
    // Load the PDF file
    const loader = new PDFLoader(data.path);
    const docs = await loader.load();
    // console.log(`Number of pages in the PDF: ${docs.length}`);

    // // Split the PDF into chunks
    // const textSplitter = new CharacterTextSplitter({
    //     separator: ".",
    //     chunkSize: 300,
    //     chunkOverlap: 0,
    // });
    // const chunks = await textSplitter.splitDocuments(docs);
    // console.log(`Number of chunks created: ${chunks.length}`);
    // console.log(`First chunk:`, chunks[0]);

    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
        throw new Error('Missing OPENAI_API_KEY in environment');
    }

    const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-small",
        apiKey: openaiApiKey,
    });
    console.log(embeddings);
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings,
        {
            url: "http://localhost:6333",
            collectionName: "pdf_chunks",
        });
    await vectorStore.addDocuments(docs);
    console.log(`Chunks added to Qdrant DB successfully!`);
},
    {
        concurrency: 100,
        connection: {
            host: "localhost",
            port: 6379,
        }
    }
);
