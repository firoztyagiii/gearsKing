import BaseEntity from "./baseEntity";
import UserModel from "../model/userModel";

import { Model } from "mongoose";

class UserEntity<D> extends BaseEntity<D> {
  constructor(model: Model<D>) {
    super(model);
  }
  async findByEmail(email: string): Promise<D | null> {
    return await this.model.findOne({ email });
  }
}

const userEntity = new UserEntity<IUser.UserDocument>(UserModel);

export default userEntity;
