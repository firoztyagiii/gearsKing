import mongoose, { Schema } from "mongoose";
import bcryptjs from "bcryptjs";
import AppError from "../utils/AppError";
import { serializeUserData } from "../services/redis/queries/user";
import redisClient from "../services/redis/redisClient";
import { userIdEmailKey, userKey } from "../services/util/keys";
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
  passwordResetToken: {
    type: String,
  },
  resetTokenExpiresAt: {
    type: Date,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isNew && !this.isModified("password")) {
    return next();
  }
  if (this.password !== this.confirmPassword) {
    return next(new AppError("Passwords no do match", 400));
  }
  this.password = await bcryptjs.hash(this.password, 8);
  this.confirmPassword = undefined;
  this.passwordResetToken = undefined;
  this.resetTokenExpiresAt = undefined;
  next();
});

userSchema.post<IUser.UserDocument>("save", async function (doc, next) {
  try {
    const data = serializeUserData(doc);
    await redisClient.setHash(userKey(doc._id.toString()), data);
    await redisClient.setHash(userIdEmailKey(), {
      [this.email]: this._id.toString(),
    });
  } catch (err) {
    // next(err);
  }
});

userSchema.methods.compare = async function (pass: string): Promise<boolean> {
  return await bcryptjs.compare(pass, this.password);
};

const UserModel = mongoose.model<IUser.UserDocument>("Users", userSchema);

export default UserModel;
