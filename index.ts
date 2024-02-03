import express from "express";
import commonRouter from "./controllers/common";

const app = express();

app.use("/common", commonRouter);

app.listen(8000, () =>
  console.log("Beautiful todos server is running on port: 8000")
);
