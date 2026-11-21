import AppError from "@/helper/AppError";
import { NextFunction, Request, Response } from "express";

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err.statusCode)
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = [
    {
      path : "",
      message: err.message,
    }
  ];

  if(err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = [
      {
        path : "",
        message: err.message,
      }
    ];
  }else if(err instanceof Error) {
    // statusCode = 500;
    message = err.message;
    errors = [
      {
        path : "",
        message: err.message,
      }
    ];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

export default globalErrorHandler;