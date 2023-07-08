import { Request, Response, NextFunction } from "express";
import redisClient from "../services/redis/redisClient";
import { userKey } from "../services/util/keys";
import crypto from "crypto";
import AppError from "../utils/AppError";
import User from "../entity/userEntity";
import jwt, { JwtPayload } from "jsonwebtoken";

const verifyToken = (token: string): JwtPayload => {
  return new Promise((res, rej) => {
    jwt.verify(token, `${process.env.JWT_SECRET}`, (err, decode) => {
      if (err) {
        rej(err);
      }
      if (decode) {
        res(decode);
      }
    });
  });
};

// users --> {
// key: value,
// key2: value,
// }

const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = "";
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(new AppError("You are not logged in", 401));
    }

    const decodedPayload = await verifyToken(token);

    const redisUser = await redisClient.getHash<IRedisUser.UserDocument>(
      userKey(decodedPayload.id)
    );
    if (redisUser) {
      res.locals.user = redisUser;
      return next();
    }
    const user = await User.findOne(decodedPayload.id);
    if (!user) {
      return next(new AppError("Invalid token. Please login again", 401));
    }
    user.password = "";
    res.locals.user = user;
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const forgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next(
        new AppError("Email is required in order to reset the password", 400)
      );
    }
    const user = await User.findByEmail(email);
    if (!user) {
      return next(new AppError("No user exists", 400));
    }
    const hash = crypto.randomBytes(120).toString("hex");
    user.passwordResetToken = hash;
    user.resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await user.save({ validateBeforeSave: false });
    res.status(200).json({
      status: "success",
      message: "Email sent with the password reset URL",
      token: hash,
    });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { resetToken } = req.query;
    const { password, confirmPassword } = req.body;
    if (!resetToken || typeof resetToken !== "string") {
      return next(new AppError("No reset token found", 400));
    }
    const user = await User.findByResetToken(resetToken);
    if (!user) {
      return next(new AppError("Invalid token or token has expired", 400));
    }
    user.password = password;
    user.confirmPassword = confirmPassword;
    await user.save({ validateBeforeSave: true });
    res.status(201).json({
      status: "success",
      message: "Password changed successfully",
    });
  } catch (err) {
    next(err);
  }
};

const protectedTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(res.locals.user.role)) {
      return next(new AppError("You are not allowed", 401));
    }
    next();
  };
};

export { protectRoute, protectedTo, forgetPassword, resetPassword };
