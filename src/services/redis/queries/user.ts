import { Types } from "mongoose";
import { userKey } from "../../util/keys";
import redisClient from "../redisClient";

const serialize = (data: IUser.UserDocument): { [key: string]: string } => {
  return {
    email: data.email,
    username: data.username,
    photo: data.photo,
    role: data.role,
    createdAt: new Date(data.createdAt).getTime().toString(),
  };
};

export const createUser = async (
  id: Types.ObjectId,
  user: IUser.UserDocument
) => {
  try {
    const serializedUser = serialize(user);
    console.log("SERIALIZED USER --->", serializedUser);
    await redisClient.setHash(userKey(id), serializedUser);
  } catch (err) {
    throw err;
  }
};

export const getUser = async (
  id: Types.ObjectId
): Promise<IRedisUser.UserDocument> => {
  const userRedis = await redisClient.getHash<IRedisUser.UserDocument>(
    userKey(id)
  );
  return userRedis;
};
