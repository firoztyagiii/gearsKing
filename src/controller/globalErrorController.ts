import { ErrorRequestHandler, Response } from "express";

const handleValidationError = (err: any, res: Response) => {
  let message: string[] = [];

  if (err.message.includes("Cast to ObjectId")) {
    message.push(err.message.split('"')[1]);
    return res.status(400).json({
      status: "failed",
      message: `Strings ${message.join(", ")} cannot be converted to ObjectId`,
    });
  }

  for (const error in err.errors) {
    message.push(err.errors[error].message);
  }
  res.status(400).json({
    status: "failed",
    message: message.join(", "),
  });
};

const handleDuplicateKeyError = (err: any, res: Response) => {
  let message: string[] = [];

  const keys = Object.keys(err.keyValue);

  for (const key of keys) {
    const err = `${key.slice(0, 1).toUpperCase()}${key.slice(1)}`;
    message.push(err);
  }

  res.status(400).json({
    status: "failed",
    message: `${message.join(", ")} already in use.`,
  });
};

const globalError: ErrorRequestHandler = (err, req, res, next) => {
  if (err.isOperational) {
    return res.status(err.code).json({
      status: err.status,
      message: err.message,
    });
  }
  if (err.name === "ValidationError") {
    return handleValidationError(err, res);
  }
  if (err.code === 11000) {
    return handleDuplicateKeyError(err, res);
  }
  res.json(err);
};

export default globalError;
