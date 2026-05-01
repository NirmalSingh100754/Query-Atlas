import {Worker} from "bullmq";

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
},
{
    concurrency:100 ,
    connection: {
        host: "localhost",
        port: 6379,
    }
}
);
