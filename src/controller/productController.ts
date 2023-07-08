import { Request, Response, NextFunction } from "express";
import Product from "../entity/productEntity";
import mongoose from "mongoose";
import AppError from "../utils/AppError";

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
      category,
    } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      thumbnail,
      images,
      productDetails,
      category,
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
    const product = await Product.findOne(new mongoose.Types.ObjectId(id));
    if (!product) {
      return next(new AppError("No product found", 400));
    }
    res.status(200).json({
      status: "success",
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.findAllProducts(req.query);
    res.status(200).json({
      status: "success",
      total: products?.length,
      data: products,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const patchProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      stock,
      thumbnail,
      images,
      productDetails,
      category,
    } = req.body;
    const product = await Product.update(new mongoose.Types.ObjectId(id), {
      name,
      description,
      price,
      stock,
      thumbnail,
      images,
      productDetails,
      category,
    });
    res.status(201).json({
      status: "success",
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await await Product.delete(new mongoose.Types.ObjectId(id));
    res.status(202).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

export { postProduct, getProduct, getProducts, patchProduct, deleteProduct };
