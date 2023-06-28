import ProductModel from "../model/productModel";

const create = async (
  product: IProduct.Product
): Promise<IProduct.ProductDocument> => {
  return await ProductModel.create(product);
};

export default { create };
