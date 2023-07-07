export as namespace IRedisUser;

export interface UserDocument {
  email: string;
  username: string;
  photo: string;
  role: string;
  createdAt: string;
}
