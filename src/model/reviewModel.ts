import mongoose, { Schema } from "mongoose";
import Product from "../entity/productEntity";

const reviewSchema = new Schema<IReview.ReviewDocument, IReview.ReviewModel>({
  review: {
    type: String,
    required: [true, "Review is required"],
  },
  ratings: {
    type: Number,
    required: [true, "Ratings are required"],
    min: [1, "Minimum rating should be 1"],
    max: [5, "Maximum rating should be 5"],
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
    required: [true, "Product is required to post a review"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: [true, "User is required to post a review"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

reviewSchema.post("save", async function (doc: IReview.ReviewDocument) {
  try {
    const agg = await ReviewModel.aggregate([
      { $match: { product: doc.product } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          average: { $avg: "$ratings" },
        },
      },
    ]);
    const { total, average } = agg[0];
    await Product.updateReview(doc.product, {
      total,
      average,
    });
  } catch (err) {
    throw err;
  }
});

reviewSchema.post(
  "findOneAndUpdate",
  async function (doc: IReview.ReviewDocument) {
    try {
      const agg = await ReviewModel.aggregate([
        { $match: { product: doc.product } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            average: { $avg: "$ratings" },
          },
        },
      ]);
      const { total, average } = agg[0];
      await Product.updateReview(doc.product, {
        total,
        average,
      });
    } catch (err) {
      throw err;
    }
  }
);

const ReviewModel = mongoose.model<IReview.ReviewDocument, IReview.ReviewModel>(
  "Reviews",
  reviewSchema
);

export default ReviewModel;
