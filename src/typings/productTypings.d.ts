export as namespace IProduct;

import { Document } from "mongoose";

export interface Product {
  name: string;
  description: string;
  price: number;
  stock: number;
  totalReviews?: number;
  averageReview?: number;
  productDetails: { [key: string]: string };
  thumbnail: string;
  images: string[];
}

export interface ProductDocument extends Product, Document {}
