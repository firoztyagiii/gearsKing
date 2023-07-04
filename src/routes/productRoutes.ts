import express from "express";
const router = express.Router();

import * as productController from "../controller/productController";

router
  .route("/:id")
  .get(productController.getProduct)
  .patch(productController.patchProduct);

router
  .route("/")
  .get(productController.getProducts)
  .post(productController.postProduct);

export default router;
