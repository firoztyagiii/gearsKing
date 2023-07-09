import mongoose, { Schema } from "mongoose";
import redisClient from "../services/redis/redisClient";
import { reviewKey, productKey } from "../services/util/keys";
import { serializeReviewData } from "../services/redis/queries/review";
import { serializeProductData } from "../services/redis/queries/product";
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
    const product = await Product.updateReview(doc.product, {
      total,
      average,
    });
    await redisClient.setJSONHash(reviewKey(doc._id), serializeReviewData(doc));
    if (product) {
      await redisClient.setJSONHash(
        productKey(product._id),
        serializeProductData(product)
      );
    }
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
      const product = await Product.updateReview(doc.product, {
        total,
        average,
      });
      await redisClient.setJSONHash(
        reviewKey(doc._id),
        serializeReviewData(doc)
      );
      if (product) {
        await redisClient.setJSONHash(
          productKey(product._id),
          serializeProductData(product)
        );
      }
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
