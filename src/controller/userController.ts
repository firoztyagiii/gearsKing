import { Request, Response, NextFunction } from "express";
import redisClient from "../services/redis/redisClient";
import { userIdEmailKey, userKey } from "../services/util/keys";
import { comparePassword, signToken } from "../utils/user";
import User from "../entity/userEntity";
import AppError from "../utils/AppError";

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, username, confirmPassword } = req.body;
    const user = await User.create({
      email,
      password,
      username,
      confirmPassword,
    });
    if (!user) return next(new AppError("Could not create user", 500));
    res.status(201).json({
      status: "success",
      data: {
        id: user?._id,
      },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("Email and password are required", 400));
    }

    const redisUser = await redisClient.findUserByEmail(email);

    if (redisUser) {
      const isPassCorrect = await comparePassword(password, redisUser.password);
      if (!isPassCorrect) return next(new AppError("Invalid credentials", 400));
      const token = await signToken({ id: redisUser._id });
      return res.status(200).json({
        status: "success",
        token,
      });
    }

    const user = await User.findByEmail(email);
    if (!user) return next(new AppError("Invalid credentials", 400));
    const isPassCorrect = await comparePassword(password, user.password);
    if (!isPassCorrect) return next(new AppError("Invalid credentials", 400));
    const token = await signToken({ id: user._id });
    res.status(200).json({
      status: "success",
      token,
    });
  } catch (err) {
    next(err);
  }
};

const aboutMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const redisUser = await redisClient.findUserByEmail(res.locals.user.email);
    if (redisUser) {
      redisUser.password = "";
      res.status(200).json({
        status: "success",
        data: redisUser,
      });
    }

    const user = await User.findByEmail(res.locals.user.email);
    if (!user) {
      return next(new AppError("No user found", 400));
    }
    user.password = "";
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

export { signUp, login, aboutMe };
