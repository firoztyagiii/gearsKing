import path from "path";
import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(__dirname, "../config.env"),
  debug: true,
});

import mongoose from "mongoose";
import { app } from "./app";

const URI = "mongodb://127.0.0.1:27017/gearsKing";
const client = createClient();

const init = async () => {
  try {
    await mongoose.connect(URI);
    console.log("Connected to MongoDB");
    await client.connect();
    console.log("Connected to Redis");
    app.listen(process.env.PORT, () => {
      console.log("Server started!");
    });
  } catch (err) {
    console.error(err);
  }
};

init();

export { client };
