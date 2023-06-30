import express from "express";

const app = express();

import globalError from "./controller/globalErrorController";
import userRouter from "./routes/userRoutes";
import productRouter from "./routes/productRoutes";
import reviewRouter from "./routes/reviewRoutes";

app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/review", reviewRouter);

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "failed",
    message: "Not found",
  });
});
app.use(globalError);

export { app };
