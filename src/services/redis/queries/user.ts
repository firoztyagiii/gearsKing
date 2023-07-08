import { Types } from "mongoose";
import { userKey } from "../../util/keys";

const serialize = (data: IUser.UserDocument): { [key: string]: string } => {
  return {
    _id: data._id.toString(),
    email: data.email,
    username: data.username,
    photo: data.photo,
    role: data.role,
    createdAt: new Date(data.createdAt).getTime().toString(),
    password: data.password,
  };
};

export const serializeUserData = (
  id: Types.ObjectId,
  user: IUser.UserDocument
): { key: string; data: { [key: string]: string } } => {
  return {
    key: userKey(id),
    data: serialize(user),
  };
};
