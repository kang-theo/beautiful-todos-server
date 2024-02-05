import { Request, Response, NextFunction } from "express";
import { Prisma } from "@/lib/prisma";
import { IApiRes } from "@/interfaces/common";
import { APIError } from "@/lib/apiError";

/**
 * Catch prisma ORM error
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

/**
 * Log API reqquest basic info
 */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  console.log(`${req.method} - ${req.url}`);
  next();
}

/**
 * Error handling Middleware function for logging the error message
 */
export function errorLogger(
  error: APIError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(`${req.method} url: ${req.url} -- error: "${error.message}"`);
  // not to handle the error, call next middleware to do it
  next(error);
}

/**
 * 404 error for undefined paths
 */
export function invalidPathHandler(
  req: Request,
  res: Response,
  next: NextFunction
): IApiRes {
  return res.send({
    statusCode: 404,
    message: "Invalid path",
  });
}

/**
 * Catch all unexcepted errors
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction // pass to next middleware
): IApiRes {
  res.header("Content-Type", "application/json");

  if (error instanceof APIError) {
    // res.send default: 200
    return res.status(error.statusCode).send({
      statusCode: `${error.statusCode}` || "500",
      message: error.message || "Server internal error, please contact support.",
    });
  } else {
    return res.status(500).send({
      statusCode: "500",
      message: "Server internal error, please contact support.",
    });
  }
}