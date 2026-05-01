import cors from "cors";
import express from "express";
import multer from "multer";
import {Queue} from "bullmq";

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

app.listen(8000, () => console.log("Server is running on port 8000"));
