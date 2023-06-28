export as namespace IProduct;

import { Document } from "mongoose";

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
