import { Types, Document, Model } from "mongoose";

export as namespace IReview;

export interface Review {
  review: string;
  ratings: number;
  user: Types.ObjectId;
  product: Types.ObjectId;
}

export interface ReviewStaticMethods {
  updateReviews(): void;
  myStaticMethod(): number;
}

export interface ReviewDocument extends Review, Document {
  createdAt: Date;
}

export interface ReviewModel
  extends Model<ReviewDocument>,
    ReviewStaticMethods {}
