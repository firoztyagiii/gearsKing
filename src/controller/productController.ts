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
    const product = await Product.create({
      name,
      description,
      price,
      stock,
      thumbnail,
      images,
      productDetails,
    });
    res.status(201).json({
      status: "success",
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne(id);
    res.status(200).json({
      status: "success",
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  const products = await Product.findAll();
  res.status(200).json({
    status: "success",
    data: products,
  });
};

export { postProduct, getProduct, getProducts };
