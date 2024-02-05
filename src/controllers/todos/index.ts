import { Router, Request, Response } from "express";
import { IApiRes } from "@/interfaces/common";
import { ITodo, TodoStatus } from "@/interfaces/todo";
import Todo from "@/models/todo";

const router = Router();

// Abstract potential ui opreations(create, update status, delete, clear all) into APIs below:
// GET /todos, get todos by condition
router.get("/", (req, res) => {});

// POST /todos, create todo, test by postman
 // ITodo: In TypeScript, when working with Express.js, you can define an interface or type that represents the structure of your request body. 
 // This allows you to enforce a specific shape for the incoming JSON payload.
router.post("/", async (req: Request<{}, {}, ITodo>, res: Response) => {
  const reqBody: ITodo = req.body;
  const newTodo = new Todo(reqBody.title);

  const result: IApiRes | undefined = await newTodo.save();
  console.log(result);
  if (result && result.statusCode === "OK") {
    return res.status(201).send({ // "201 Created", API response should be conform to HTTP standard
      ...result,
      message: "Created todo successfully",
    });
  }
  // error situation, handle the case where result is undefined or statusCode is not "OK"
  return res.status(500).send({
    message: "Error creating todo",
  });
});

// PUT /todos/:id, update todo
router.put("/:id", (req, res) => {});

// DELETE /todos/completed, clear all completed todos
router.delete("/completed", (req, res) => {});

export default router;