import { ErrorRequestHandler, Response } from "express";

const handleValidationError = (err: any, res: Response) => {
  let message: string[] = [];
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
  if (err.name === "ObjectParameterError") {
    console.log(err);
  }
  res.json({ msg: err.message });
};

export default globalError;
