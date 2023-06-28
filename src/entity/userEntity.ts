import UserModel from "../model/userModel";
import AppError from "../utils/AppError";

const create = async (user: IUser.User): Promise<IUser.UserDocument> => {
  const createdUser = await UserModel.create(user);
  return createdUser;
};

const findByEmail = async (email: string): Promise<IUser.UserDocument> => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new AppError("Invalid credentials", 400);
  }
  return user;
};

export { create, findByEmail };
