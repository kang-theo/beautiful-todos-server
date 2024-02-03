import express from "express";
import commonRouter from "./controllers/common";

const app = express();

app.use("/common", commonRouter);

app.use("/", (req, res)=>{
  res.send("Hello, Express.");
})

app.listen(8000, () =>
  console.log("Server is running at: http://localhost:8000")
);
