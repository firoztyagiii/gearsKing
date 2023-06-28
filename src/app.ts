import express from "express";

const app = express();

import globalError from "./controller/globalErrorController";
import userRouter from "./routes/userRoutes";
import productRouter from "./routes/productRoutes";

app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "failed",
    message: "Not found",
  });
});
app.use(globalError);

export { app };
