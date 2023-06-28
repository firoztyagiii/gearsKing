export as namespace IUser;

import { Document } from "mongoose";
import { UserRole } from "../config/enums";

export interface User {
  email: string;
  username: string;
  password: string;
  photo?: string;
  role?: UserRole;
  createdAt?: Date;
  confirmPassword: string | undefined;
}

export interface UserDocument extends User, Document {
  compare(password: string): Promise<boolean>;
}
