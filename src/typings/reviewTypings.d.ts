import { Types, Document } from "mongoose";

export as namespace IReview;

export interface Review {
  review: string;
  ratings: number;
}

export interface ReviewDocument extends Review, Document {
  createdAt: Date;
  user: Types.ObjectId;
  product: Types.ObjectId;
}
