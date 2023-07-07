export as namespace IUser;

import { Document } from "mongoose";
import { UserRole } from "../config/enums";

export interface User {
  email: string;
  username: string;
  password: string;
  confirmPassword: string | undefined;
}

export interface UserDocument extends User, Document {
  photo: string;
  role: UserRole;
  createdAt: Date;
  passwordResetToken: string | undefined;
  resetTokenExpiresAt: Date | undefined;
  compare(password: string): Promise<boolean>;
}
