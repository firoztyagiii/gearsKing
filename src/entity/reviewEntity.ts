import ReviewModel from "../model/reviewModel";
import BaseEntity from "./baseEntity";
import { Model } from "mongoose";

class ReviewEntity<D> extends BaseEntity<D> {
  constructor(model: Model<D>) {
    super(model);
  }
}

const reviewEntity = new ReviewEntity<IReview.ReviewDocument>(ReviewModel);

export default reviewEntity;
