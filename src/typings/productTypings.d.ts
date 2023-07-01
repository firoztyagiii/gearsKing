export as namespace IProduct;

import { Document, Model } from "mongoose";

interface ProductDetails {
  attrKey: string;
  attrValue: string;
}

export interface Product {
  name: string;
  description: string;
  price: number;
  stock: number;
  totalReviews?: number;
  averageReview?: number;
  productDetails: ProductDetails[];
  thumbnail: string;
  images: string[];
}

export interface ProductDocument extends Product, Document {}

export interface ProductModel extends Model<Product, ProductDocument> {}
