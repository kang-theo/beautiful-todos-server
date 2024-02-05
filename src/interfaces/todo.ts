/**
 * Define TODO interface
 * @field id: {string} primary key
 * @field title: {string} todo's title
 * @field status: {string} todo's status, enum value: New and Completed
 * @field createdAt: {string} todo's created timestamp
 * @field lastUpdatedAt: {string} todo's lastest updated timestamp
 * @field completedAt: {string} todo's completed timestamp
 * @field creator: {string}{optional} system could persist todo's creator name if necessary
 */
export interface ITodo {
  id: string;
  title: string;
  status: "Open" | "Completed";
  createdAt: string;
  lastUpdatedAt: string;
  completedAt: string;
  creator?: string | null;
}

export type TodoStatus = "Open" | "Completed";
