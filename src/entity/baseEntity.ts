import { FilterQuery, Model, Types } from "mongoose";
import AppError from "../utils/AppError";

class BaseEntity<D> {
  constructor(protected model: Model<D>) {}

  async findOne(
    filter: FilterQuery<D>,
    projection: { [key: string]: string } = {},
    opts: { [key: string]: string } = {}
  ): Promise<D | null> {
    return await this.model.findOne(filter, projection, opts);
  }

  async pagination(query: any, page: number, totalDocs: number) {
    const LIMIT = 10;
    const TOTALDOC = totalDocs;
    const TOTALPAGES = Math.ceil(TOTALDOC / LIMIT);

    if (page > TOTALPAGES) {
      throw new AppError("Maximum page number exceeded", 400);
    }
    let SKIP = page - 1 * LIMIT;
    if (SKIP < 1) {
      SKIP = 0;
    }
    return query.skip(SKIP).limit(LIMIT);
  }

  async create(payload: { [key: string]: string }): Promise<D | null> {
    return await this.model.create(payload);
  }

  async update(
    id: Types.ObjectId,
    payload: { [key: string]: string }
  ): Promise<D | null> {
    return await this.model.findOneAndUpdate({ _id: id }, payload, {
      new: true,
    });
  }
  async delete(id: Types.ObjectId) {
    return await this.model.deleteOne({ _id: id });
  }
}

export default BaseEntity;
