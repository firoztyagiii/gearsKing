import ReviewModel from "../model/reviewModel";
import BaseEntity from "./baseEntity";
import { Model } from "mongoose";

class ReviewEntity<D> extends BaseEntity<D> {
  constructor(model: Model<D>) {
    super(model);
  }
  async findAllReviews(filter: any) {
    const query = this.model.find({});

    if (filter.ratings) {
      const rating = filter.ratings.split("-");
      const min = rating[0];
      const max = rating[1];
      query.find({
        $and: [{ ratings: { $lte: max } }, { ratings: { $gte: min } }],
      });
    }

    if (filter.product) {
      query.find({ product: filter.product });
    }

    return query;
  }
}

const reviewEntity = new ReviewEntity<IReview.ReviewDocument>(ReviewModel);

export default reviewEntity;
