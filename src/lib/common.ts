import { Prisma } from "@/lib/prisma";
import { IApiRes } from "@/interfaces/common";

/**
 * Catch prisma ORM error
 * @param defaultMsg
 * @param err
 * @returns {IApiRes}
 */
export function catchORMError(defaultMsg: string, err?: Error): IApiRes {
  // type narrowing
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return {
      statusCode: "PRISMA CLIENT REQUEST ERROR",
      message: err.message,
    };
  }

  return {
    statusCode: "UNKNOWN REQUEST ERROR",
    message: defaultMsg,
  };
}
