import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(__dirname, "../config.env"),
  debug: true,
});

import mongoose from "mongoose";
import { app } from "./app";

const URI = "mongodb://127.0.0.1:27017/gearsKing";

const init = async () => {
  try {
    await mongoose.connect(URI);
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () => {
      console.log("Server started!");
    });
  } catch (err) {
    console.error(err);
  }
};

init();
