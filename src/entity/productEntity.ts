import ProductModel from "../model/productModel";
import BaseEntity from "./baseEntity";

import { Model, Types } from "mongoose";

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
}

const productEntity = new ProductEntity<IProduct.ProductDocument>(ProductModel);

export default productEntity;
