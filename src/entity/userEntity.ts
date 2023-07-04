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

  async findByResetToken(token: string | string[]) {
    return await this.model.findOne({
      passwordResetToken: token,
      resetTokenExpiresAt: { $gte: Date.now() },
    });
  }
}

const userEntity = new UserEntity<IUser.UserDocument>(UserModel);

export default userEntity;
