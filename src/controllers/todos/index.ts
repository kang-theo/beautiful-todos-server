import { Router, Request, Response, NextFunction } from "express";
import { IApiRes } from "@/interfaces/common";
import { ITodo, TodoStatus } from "@/interfaces/todo";
import Todo from "@/models/todo";
import { APIError } from "@/lib/apiError";

const router = Router();

// Abstract potential ui opreations(create, update status, delete, clear all) into APIs below:
// get one todo by id (:id - route param - req.params.id - it is a path param lke: /user/123, ?id - query param - req.query.id - it is a query param, like: /user?id=123)
router.get("/:id", async (req: Request<{id: string}, {}, ITodo>, res: Response, next: NextFunction) => {
  // const todoId = req.query.id; // /?id=xxx
  const todoId = req.params.id;
  // check the request parameters; if matched the route, the id must not be undefined
  if(todoId === undefined){
    const apiError = new APIError(400, "Missing todo id");
    next(apiError);
  }

  const result: IApiRes = await Todo.find(todoId as string);
  
  if (result.statusCode === "OK") {
    return res.status(200).send({
      ...result,
      message: "Fetch a todo successfully"
    });
  } else {
    // handle backend errors in errorHandler
    const apiError = new APIError(500, result.message || "Error finding a todo");
    next(apiError);
  }
});

// GET /todos, get all todos
router.get("/", async (req: Request<{}, {}, ITodo>, res: Response, next: NextFunction) => {
  const status = req.query.status;
  let result: IApiRes;

  if (status === undefined) {
    // get all todos
    result = await Todo.findAll();
  } else {
    // get all Open | Completed todos
    result = await Todo.findByStatus(status as TodoStatus);
  }

  if (result && result.statusCode === "OK") {
    return res.status(200).send({
      ...result,
      message: `Fetch all ${status} todos successfully`
    });
  } else {
    const apiError = new APIError(500, result.message || `Error finding ${status} todos`);
    next(apiError); 
  }
});

// POST /todos, create todo, test by postman
 // ITodo: In TypeScript, when working with Express.js, you can define an interface or type that represents the structure of your request body. 
 // This allows you to enforce a specific shape for the incoming JSON payload.
router.post("/", async (req: Request<{}, {}, ITodo>, res: Response, next: NextFunction) => {
  const reqBody: ITodo = req.body;
  const newTodo = new Todo(reqBody.title);

  // try/catch
  const result: IApiRes = await newTodo.save();
  if (result && result.statusCode === "OK") {
    return res.status(201).send({ // "201 Created", API response should be conform to HTTP standard
      ...result,                  // If result has properties like message you explicitly set in the new object (e.g., { ...result, message: "Created todo successfully" }), the values in the new object will overwrite the existing values in result. 
      message: "Create a todo successfully",
    });
  } else{
    // will be logged in errorLogger middleware
    // console.error(result.message);

    // response to frontend, do not expose sensitive information
    const apiError = new APIError(500, result.message || "Error creating a todo");
    next(apiError);
  }
});

// PUT /todos/:id, update todo
router.put("/:id", async (req: Request<{id: string}, {}, ITodo>, res: Response, next: NextFunction) => {
  if(!req.query.status ||
     !["Open", "Completed"].includes(req.query.status as string)
  ) {
    const apiError = new APIError(400, "Query parameter status is required and must be Open or Completed");
    next(apiError);
  }

  // If matched the route, the id must be valid
  // const todoId = req.query.id;
  // if(todoId === undefined){
  //   const apiError = new APIError(400, "Missing todo id");
  //   next(apiError); 
  // }

  // if just change the status of a resource or modifying a small set of properties, not need a request body in PUT.
  // const reqBody: ITodo = req.body;

  let result: IApiRes = await Todo.find(req.params.id);
  if (!result || result.statusCode !== "OK") {
    const apError = new APIError(404, "Todo not found");
    next(apError);
  } 

  //convert prisma record to an Todo model instance 
  // const todo = new Todo("");

  // add createdAt and lastUpdateAt when creating, and update lastUpdateAt when updating 
  result = await Todo.update(result.data.id, req.query.status as TodoStatus);
  if(result && result.statusCode === "OK"){
    // 204 No Content is a common choice when updating and no need for additional data in the response.
    return res.status(200).send({
      ...result,
      message: "Update a todo successfully"
    })
  } else{
    const apiError = new APIError(500, result.message || "Error updating a todo");
    next(apiError);
  }
});

// DELETE /todos/completed, clear all completed todos
// route parameters are placeholders. if /:id comes before /completed, Express will match completed as a value for the :id in the first route.
router.delete("/completed", async (req: Request<{}, {}, ITodo>, res: Response, next: NextFunction) => {
  const result: IApiRes = await Todo.destroyByStatus("Completed");

  if (result && result.statusCode === "OK") {
    return res.status(200).send({
      ...result,
      message: "Clear all completed todos successfully"
    });
  } else {
    const apiError = new APIError(500, result.message || "Error clearing all completed todos");
    next(apiError);
  }
});

// DELETE /todos/id, delete a todo with id
router.delete("/:id", async (req: Request<{id: string}, {}, ITodo>, res: Response, next: NextFunction)=>{
  const result: IApiRes = await Todo.destroy(req.params.id);

  if (result && result.statusCode === "OK") {
    return res.status(200).send({
      ...result,
      message: "Delete a todo successfully"
    });
  } else {
    const apiError = new APIError(500, result.message || "Error deleting a todo");
    next(apiError);
  }
});

export default router;