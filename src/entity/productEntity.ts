import AppError from "../utils/AppError";
import ProductModel from "../model/productModel";

const create = async (
  product: IProduct.Product
): Promise<IProduct.ProductDocument> => {
  return await ProductModel.create(product);
};

const findOne = async (id: string): Promise<IProduct.ProductDocument> => {
  const product = await ProductModel.findOne({ _id: id });
  if (!product) {
    throw new AppError("No product found", 400);
  }
  return product;
};

const findAll = async (): Promise<IProduct.ProductDocument[]> => {
  const products = await ProductModel.find();
  return products;
};

export default { create, findOne, findAll };
