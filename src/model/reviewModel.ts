import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema<IReview.ReviewDocument>({
  review: {
    type: String,
    required: [true, "Review is required"],
  },
  ratings: {
    type: Number,
    required: [true, "Ratins are required"],
    min: [1, "Minimum rating should be 1"],
    max: [5, "Maximum rating should be 5"],
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const ReviewModel = mongoose.model<IReview.ReviewDocument>(
  "Reviews",
  reviewSchema
);

export default ReviewModel;
