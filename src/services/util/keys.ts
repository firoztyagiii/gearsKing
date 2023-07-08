import { Types } from "mongoose";

const userKey = (id: Types.ObjectId): string => `user#${id.toString()}`;
const productKey = (id: Types.ObjectId): string => `product#${id.toString()}`;
const reviewKey = (id: Types.ObjectId): string => `review#${id.toString()}`;
const uniqueEmailKey = (): string => `user#uniqueEmail`;

export { userKey, productKey, reviewKey, uniqueEmailKey };
