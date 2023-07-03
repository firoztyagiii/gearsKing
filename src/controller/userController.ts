import { Request, Response, NextFunction } from "express";
import User from "../entity/userEntity";
import AppError from "../utils/AppError";
import jwt from "jsonwebtoken";

const signToken = (payload: object) => {
  return new Promise((res, rej) => {
    jwt.sign(
      payload,
      `${process.env.JWT_SECRET}`,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          rej(err);
        }
        res(token);
      }
    );
  });
};

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, username, confirmPassword } = req.body;
    const user = await User.create({
      email,
      password,
      username,
      confirmPassword,
    });
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
    const user = await User.findByEmail(email);
    if (!user) return next(new AppError("Invalid credentials", 400));
    const isPassCorrect = await user.compare(password);
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

export { signUp, login };
