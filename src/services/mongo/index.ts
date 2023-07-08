import mongoose from "mongoose";

const URI = "mongodb://127.0.0.1:27017/gearsKing";

export default async function () {
  await mongoose.connect(URI);
}
