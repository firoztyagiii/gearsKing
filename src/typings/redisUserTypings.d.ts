export as namespace IRedisUser;

export interface UserDocument {
  _id: string;
  email: string;
  password: string;
  username: string;
  photo: string;
  role: string;
  createdAt: string;
}
