import bcryptjs from "bcryptjs";

export const comparePassword = async (userPass: string, hashedPass: string) => {
  return await bcryptjs.compare(userPass, hashedPass);
};
