class AppError extends Error {
  code: number;
  status: string;
  isOperational: boolean;
  constructor(msg: string, code: number) {
    super(msg);
    this.code = code;
    this.status = "failed";
    this.isOperational = true;
  }
}

export default AppError;
