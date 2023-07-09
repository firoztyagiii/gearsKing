import { Request, Response, NextFunction } from "express";
import redisClient from "../services/redis/redisClient";
import { productKey } from "../services/util/keys";
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
    const redisProduct =
      await redisClient.getJSONHash<IProduct.ProductDocument>(productKey(id));
    if (redisProduct) {
      return res.status(200).json({
        status: "success",
        data: redisProduct,
      });
    }
    const product = await Product.findOne({ _id: id });
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
    await Product.delete(new mongoose.Types.ObjectId(id));
    await redisClient.deleteHash(productKey(id));
    res.status(202).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

export { postProduct, getProduct, getProducts, patchProduct, deleteProduct };
