import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const comparePassword = async (userPass: string, hashedPass: string) => {
  return await bcryptjs.compare(userPass, hashedPass);
};

export const signToken = (payload: object) => {
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
