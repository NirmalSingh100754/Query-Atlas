import cors from "cors";
import express from "express";

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  return res.json({
    message: "Hello from the server",
  });
});

app.listen(8000, () => console.log("Server is running on port 8000"));
