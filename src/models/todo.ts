// import { uuid } from "uuidv4";
import dayjs from "dayjs";
import { IApiRes } from "@/interfaces/common";
import { catchORMError } from "@/lib/common";
import { Todo as PrismaTodo, TodoStatus } from "@prisma/client";
import prisma from "@/lib/prisma";

// Convention: model name is singular, datatable name is plural
class Todo {
  // be created by prisma cuid when persisting, not essential here
  id?: string;
  status: "Open" | "Completed";

  // items below are hidden from UI, but essential for database
  createdAt: string;
  lastUpdatedAt: string;
  completedAt: string | null;
  readonly creator?: string | null; 

  // likes DI(Dependency Injection)
  constructor(public title: string) {
    // this.id = uuid();
    this.status = "Open";
    // format current date and time to string
    const currDateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
    this.createdAt = currDateTime;
    this.lastUpdatedAt = currDateTime;
    this.completedAt = null;
    this.creator = null;
  }

  // Persist in database; These methods are corresponding to APIs in todos controller who use these methods to interact with database
  // methods based on one record should be instance methods
  async save(): Promise<IApiRes> {
    // async request(like database query) should be in try/catch block
    try {
      const { title, status, createdAt, lastUpdatedAt, completedAt, creator } = this;

      // return value is in prisma client, which represents the structure of the database model for the todo table 
      const newTodo: PrismaTodo = await prisma.todo.create({
        data: {
          title,
          status,
          createdAt,
          lastUpdatedAt,
          completedAt: completedAt!,
          creator,
        },
      });

      if (newTodo) {
        return {
          statusCode: "OK",
          data: newTodo as Todo,
        };
      } else {
        return catchORMError("Failed to create todo");
      }
    } catch (err: any) { // "unknown" is safer than "any" because it still requires type checking before using
      return catchORMError("Failed to create todo", err);
    }
  }

  // should the update be static, but it is complex to transfer from prisma object to Todo object
  static async update(id: string, newStatus: TodoStatus): Promise<IApiRes> {
    try {
      const todo: PrismaTodo | null = await prisma.todo.update({
        // where: { id: this.id },
        where: { id: id },
        data: { status: newStatus }
      })

      if (todo) {
        return {
          statusCode: "OK",
          data: todo
        }
      } else {
        return catchORMError(`Failed to update todo status with id(${id})`);
      }
    } catch (error: any) {
        return catchORMError(`Failed to update todo status with id(${id})`, error);
    }
  }

  // methods not based on one record should be static, belonging to class
  /**
   * Find a todo with id
   * @param id - The todo's id from request
   * @returns A todo object
   */
  static async find(id: string): Promise<IApiRes> {
    try {
      const todo: PrismaTodo | null  = await prisma.todo.findUnique({
        where: { id: id }
      });

      if(todo){
        return {
          statusCode: "OK",
          data: todo,
        }
      } else{
        return catchORMError(`Failed to find todo with id(${id})`);
      }
    } catch (error: any) {
      return catchORMError(`Faled to find todo with id(${id})`, error); 
    }
  }

  /**
   * Find all todos
   * @returns A list of todo object
   */
  static async findAll(): Promise<IApiRes>{
    try {
      const todos: PrismaTodo[] | null = await prisma.todo.findMany();

      if(todos && todos.length > 0){
        return {
          statusCode: "OK",
          data: todos
        }
      } else{
        return catchORMError("Failed to find all todos");
      }
    } catch (error: any) {
        return catchORMError("Failed to find all todos", error);
    }
  }

  /**
   * Find todos by status
   * @param status - The status of todos 
   * @returns A list of todo object with specified status
   */
  static async findByStatus(status: TodoStatus): Promise<IApiRes>{
    try {
      const todos: PrismaTodo[] | null = await prisma.todo.findMany({
        where: {
          status: status
        }
      });

      if (todos && todos.length > 0) {
        return {
          statusCode: "OK",
          data: todos
        }
      } else {
        return catchORMError("Failed to find todos with status: " + status);
      }
    } catch (error: any) {
      return catchORMError("Failed to find todos with status: " + status, error);
    }
  }

  /**
   * Delete a todo
   * @param id - The id of the todo to be deleted
   * @returns The deleted todo object
   */
  static async destroy(id: string): Promise<IApiRes>{
    try {
      const todo: PrismaTodo | null = await prisma.todo.delete({
        where: { id: id }
      });

      if (todo) {
        return {
          statusCode: "OK",
          data: todo
        }
      } else {
        return catchORMError(`Failed to delete todo with id(${id})`);
      }
    } catch (error: any) {
        return catchORMError(`Failed to delete todo with id(${id})`, error);
    }
  }

  /**
   * Delete todos by status
   * @param status - The status of todos
   * @returns The number of deleted todos
   */
  static async destroyByStatus(status: TodoStatus): Promise<IApiRes>{
    try {
      const { count } = await prisma.todo.deleteMany({
        where: {
          status: status
        }
      });

      if (count > 0) {
        return{
          statusCode: "OK",
          message: `${count} ${status} todos were deleted`,
          data: count
        }
      } else {
          return catchORMError(`None ${status} todos were deleted`);
      }
    } catch (error: any) {
      return catchORMError("Failed to delete all completed todos", error);
    }
  }
}

export default Todo;
