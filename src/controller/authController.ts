import { Request, Response, NextFunction } from "express";
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
    const user = await User.findOne(decodedPayload.id);
    if (!user) {
      return next(new AppError("Invalid token. Please login again", 401));
    }
    user.password = "";
    res.locals.user = user;
    next();
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

export { protectRoute, protectedTo };
