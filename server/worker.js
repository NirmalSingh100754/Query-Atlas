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
    //Load the PDF file
    const loader = new PDFLOader(data.path);
    const docs = await loader.load();
    //Split the documents into chunks
    const splitter = new CharacterTextSplitter({
        chunkSize: 300,
        chunkOverlap: 0,
    });
    const chunks = await TextSplitter.splitText(docs);
    console.log(chunks);
},
    {
        concurrency: 100,
        connection: {
            host: "localhost",
            port: 6379,
        }
    }
);
