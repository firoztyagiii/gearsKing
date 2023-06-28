import express from "express";
const router = express.Router();

import * as productController from "../controller/productController";

router.get("/:id", productController.getProduct);
router.get("/", productController.getProducts);
router.post("/", productController.postProduct);

export default router;
