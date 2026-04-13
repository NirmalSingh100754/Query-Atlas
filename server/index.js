import cors from "cors";
import express from "express";
import multer from "multer";
import { stat } from "node:fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.filename + '-' + uniqueSuffix)
  }
})


const upload = multer({ dest: 'uploads/' });
const app = express();

app.use(cors());

app.get("/", (req, res) => {
  return res.json({
    message: "Hello from the server",
    status: "success",
  });
});

app.post("/upload",upload.single("pdf"), (req, res) => {
  return res.json({
    message: "File uploaded successfully",
    status: "success",
  });
});

app.listen(8000, () => console.log("Server is running on port 8000"));
