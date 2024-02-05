// import { uuid } from "uuidv4";
import dayjs from "dayjs";
import { IApiRes } from "@/interfaces/common";
import { catchORMError } from "@/lib/common";
import { Todo as PrismaTodo } from "@prisma/client";
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
    // format current datetime to string
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
      console.log(newTodo);

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

  update(status: string) {}

  // methods not based on one record should be static, belonging to class
  public static find(id: string): Todo | null {
    return null;
  }

  public static clearCompleted() {}
}

export default Todo;
