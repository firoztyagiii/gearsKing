import path from "path";
import dotenv from "dotenv";
import { app } from "./app";

dotenv.config({
  path: path.resolve(__dirname, "../config.env"),
  debug: true,
});

import connectDB from "./services/mongo";

const init = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () => {
      console.log("Server started!");
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

init();
