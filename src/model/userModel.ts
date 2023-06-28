import mongoose, { Schema } from "mongoose";
import bcryptjs from "bcryptjs";
import AppError from "../utils/AppError";

import { UserRole } from "../config/enums";

const userSchema = new Schema<IUser.UserDocument>({
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "Username is required"],
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (v: string): boolean {
        return v.length > 7;
      },
      message: "Password must be atleast 8 characters long",
    },
  },
  confirmPassword: {
    type: String,
    required: [true, "Confirm password is required."],
    validate: {
      validator: function (v: string): boolean {
        return true;
      },
      message: "Passwords do not match",
    },
  },
  photo: {
    type: String,
    default: "HHTPS://PHOTO.JPEG",
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.User,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isNew || !this.isModified("password")) {
    next();
    return;
  }
  if (this.password !== this.confirmPassword) {
    next(new AppError("Passwords no do match", 400));
    return;
  }
  this.password = await bcryptjs.hash(this.password, 8);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.compare = async function (pass: string): Promise<boolean> {
  return await bcryptjs.compare(pass, this.password);
};

const UserModel = mongoose.model<IUser.UserDocument>("Users", userSchema);

export default UserModel;
