import ProductModel from "../model/productModel";
import BaseEntity from "./baseEntity";
import AppError from "../utils/AppError";

import { Model, SortOrder, Types } from "mongoose";

class ProductEntity<D> extends BaseEntity<D> {
  constructor(model: Model<D>) {
    super(model);
  }

  async updateReview(
    id: Types.ObjectId,
    payload: { total: number; average: number }
  ): Promise<D | null> {
    return await this.model.findOneAndUpdate(
      { _id: id },
      { totalReviews: payload.total, averageReview: payload.average },
      {
        new: true,
      }
    );
  }
  async findAllProducts(filter: any): Promise<D[] | null> {
    const TOTALDOC = await this.model.countDocuments();
    const query = this.model.find({});
    if (filter.price) {
      const price = filter.price.split("-");
      const min = price[0];
      const max = price[1];

      if (min && max) {
        return query.find({
          $and: [{ price: { $lte: max } }, { price: { $gte: min } }],
        });
      }
    }

    if (filter.averagereview) {
      const review = filter.averagereview.split("-");
      const min = review[0];
      const max = review[1];

      if (min < 0 || max > 5) {
        throw new AppError("Minimum average review is 0 and 5", 400);
      }

      if (min && max) {
        return query.find({
          $and: [
            { averageReview: { $lte: max } },
            { averageReview: { $gte: min } },
          ],
        });
      }
    }

    if (filter.totalreviews) {
      const review = filter.totalreviews.split("-");
      const min = review[0];
      const max = review[1];

      if (min && max) {
        return query.find({
          $and: [
            { totalReviews: { $lte: max } },
            { totalReviews: { $gte: min } },
          ],
        });
      }
    }

    if (filter.sortby) {
      const sort: { [key: string]: 1 | -1 } = {
        [filter.sortby]: filter.order === "asc" ? -1 : 1,
      };
      return query.sort(sort);
    }

    return this.pagination(query, filter.page ? filter.page : 1, TOTALDOC);
  }
}

const productEntity = new ProductEntity<IProduct.ProductDocument>(ProductModel);

export default productEntity;
