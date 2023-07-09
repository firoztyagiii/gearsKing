import slugify from "slugify";
import mongoose, { Schema } from "mongoose";
import redisClient from "../services/redis/redisClient";
import { serializeProductData } from "../services/redis/queries/product";
import { productKey } from "../services/util/keys";

const productDetailSchema = new Schema(
  {
    attrKey: {
      type: String,
      required: [true, "Attribute key is required for the product details"],
    },
    attrValue: {
      type: String,
      required: [true, "Attribute value is required for the product details"],
    },
  },
  {
    _id: false,
    versionKey: false,
  }
);

const productSchema = new Schema<IProduct.ProductDocument>({
  name: {
    type: String,
    required: [true, "Product name is required"],
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
  },
  price: {
    type: Number,
    requried: [true, "Price is required"],
    validate: {
      validator: function (v: number): boolean {
        return v > 0;
      },
      message: "Price cannot be zero",
    },
  },
  stock: {
    type: Number,
    required: [true, "Stock is required"],
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  averageReview: {
    type: Number,
    default: 0,
  },
  productDetails: {
    type: [productDetailSchema],
    required: [true, "Product details are required"],
    validate: {
      validator: function (v: IProduct.ProductDetails[]): boolean {
        return v.length > 0;
      },
      message: "At least one detail is required",
    },
  },
  thumbnail: {
    type: String,
    required: [true, "Thumbnail is required"],
  },
  slug: {
    type: String,
  },
  category: {
    type: String,
    required: [true, "Category is required"],
  },
  // user: {
  //   type: Types.ObjectId,
  //   ref: "Users",
  //   required: [true, "User is required"],
  // },
  images: {
    type: [String],
    required: [true, "Images are required"],
    validate: {
      validator: function (v: string[]): boolean {
        return v.length > 2;
      },
      message: "At least 3 images are required",
    },
  },
});

productSchema.pre<IProduct.ProductDocument>("save", function (next) {
  if (this.isNew) {
    this.slug = slugify(this.name, { lower: true });
    next();
  }
});

productSchema.post<IProduct.ProductDocument>(
  "save",
  async function (doc: IProduct.ProductDocument) {
    try {
      await redisClient.setJSONHash(
        productKey(doc._id),
        serializeProductData(doc)
      );
    } catch (err) {
      throw err;
    }
  }
);

productSchema.post<IProduct.ProductDocument>(
  "findOneAndUpdate",
  async function (doc: IProduct.ProductDocument) {
    await redisClient.setJSONHash(
      productKey(doc._id),
      serializeProductData(doc)
    );
  }
);

const ProductModel = mongoose.model<IProduct.ProductDocument>(
  "Products",
  productSchema
);

export default ProductModel;
