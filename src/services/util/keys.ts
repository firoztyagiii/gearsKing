import { Types } from "mongoose";

const userKey = (id: Types.ObjectId | string): string =>
  `user#${id.toString()}`;
const productKey = (id: Types.ObjectId | string): string =>
  `product#${id.toString()}`;
const reviewKey = (id: Types.ObjectId | string): string =>
  `review#${id.toString()}`;
const userIdEmailKey = (): string => `user:idEmail`;

export { userKey, productKey, reviewKey, userIdEmailKey };
