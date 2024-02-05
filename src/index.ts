import express from "express";
import commonRouter from "@/controllers/common";
import todoRouter from "@/controllers/todos";
import bodyParser from "body-parser";
import {
  requestLogger,
  errorHandler,
  errorLogger,
  invalidPathHandler,
} from "@/lib/common";

const app = express();

// Middleware: 
// parse JSON in the request body and make it available in req.body
// often used with API endpoints that receive data in JSON format, such as POST requests
app.use(bodyParser.json());
// log request info
app.use(requestLogger);

app.use("/common", commonRouter);
app.use("/todos", todoRouter);

// Catch global exception
// errors occur in above middlewares or routes will be logged here; for backend debugging
app.use(errorLogger);
// specific error-handling middleware: invalid path
app.use(invalidPathHandler);
// general error-handling middleware (this should be the last middleware)
app.use(errorHandler);

app.listen(8000, () =>
  console.log("Server is running at: http://localhost:8000")
);
