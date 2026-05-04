import {Worker} from "bullmq";
import {OpenAIEmbeddings} from '@langchain/openai';
import {QudrantVectorStore} from '@langchain/qdrant';
import { Document } from "@langchain/core/documents";
import {PDFLOader} from "@langchain/community/document-loaders/fs/pdf";

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
},
{
    concurrency:100 ,
    connection: {
        host: "localhost",
        port: 6379,
    }
}
);
