export as namespace IProduct;

import { Document, Model, Types } from "mongoose";

interface ProductDetails {
  attrKey: string;
  attrValue: string;
}

export interface Product {
  name: string;
  description: string;
  price: number;
  stock: number;
  productDetails: ProductDetails[];
  thumbnail: string;
  images: string[];
  category: string;
}

export interface ProductDocument extends Product, Document {
  totalReviews: number;
  averageReview: number;
  slug: string;
  // user: Types.ObjectId;
}
