import { Model, Types } from "mongoose";

class BaseEntity<D> {
  model: Model<D>;
  constructor(model: Model<D>) {
    this.model = model;
  }

  async findOne(id: Types.ObjectId): Promise<D | null> {
    return await this.model.findOne({ _id: id });
  }

  async findAll(filter?: { [key: string]: string }): Promise<D[] | []> {
    const query = this.model.find();
    const limit = 10;
    if (filter?.sortby) {
      query.sort(filter.sortby);
    }
    if (filter?.limit) {
      query.limit(+filter.limit);
    }
    if (filter?.page) {
      query.skip(limit * +filter.page - 1);
    }
    return await query;
  }

  async create(payload: { [key: string]: string }): Promise<D | null> {
    return await this.model.create(payload);
  }

  async update(
    id: Types.ObjectId,
    payload: { [key: string]: string }
  ): Promise<D | null> {
    return await this.model.findByIdAndUpdate({ _id: id }, payload, {
      new: true,
    });
  }
  async delete(id: Types.ObjectId) {
    return await this.model.deleteOne({ _id: id });
  }
}

export default BaseEntity;
