import { Request, Response, NextFunction } from "express";
import Product from "../entity/productEntity";

const postProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      thumbnail,
      images,
      productDetails,
    } = req.body;
    console.log("Hi");
    const product = await Product.create({
      name,
      description,
      price,
      stock,
      thumbnail,
      images,
      productDetails,
    });
    console.log(product);
    res.status(201).json({
      status: "success",
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

export { postProduct };
