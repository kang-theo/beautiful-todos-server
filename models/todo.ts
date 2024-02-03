import { uuid } from "uuidv4";
import dayjs from "dayjs";

// Convention: model name is singular, datatable name is plural
class Todo {
  readonly id: string; // be created by database
  status: "Open" | "Completed";

  // items below are hidden from UI, but essential for database
  createdAt: string;
  lastUpdatedAt: string;
  completedAt: string | null;
  readonly creator?: string | null;

  // likes DI(Dependency Injection)
  constructor(public title: string) {
    // uuid
    this.id = uuid();
    this.status = "Open";
    // format current datetime to string
    const currDateTime = dayjs().format("YYYY-mm-dd HH:MM:SS");
    // "YYYY-mm-dd HH:MM:SS"
    this.createdAt = currDateTime;
    this.lastUpdatedAt = currDateTime;
    this.completedAt = null;
    // if caller could pass user information, assign it here
    this.creator = null;
  }

  // Persist in database; These methods are corresponding to APIs in todos controller who use these methods to interact with database
  // methods based on one record should be instance methods
  save(): Todo {return new Todo("new todo")}
  update(status: string) {}

  // methods not based on one record should be static, belonging to class
  public static find(id: string): Todo {return new Todo("new todo")}
  public static clearCompleted() {}
}

export default Todo;