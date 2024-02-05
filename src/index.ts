import express from "express";
import commonRouter from "@/controllers/common";
import todoRouter from "@/controllers/todos";
import bodyParser from "body-parser";

const app = express();

// parse JSON in the request body
app.use(bodyParser.json());
app.use("/common", commonRouter);
app.use("/todos", todoRouter);

app.use("/", (req, res) => {
  res.send("Hello, Express.");
});

// catch global exception

app.listen(8000, () =>
  console.log("Server is running at: http://localhost:8000")
);
