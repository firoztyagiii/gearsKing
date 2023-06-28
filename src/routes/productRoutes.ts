import express from "express";
const router = express.Router();

import * as productController from "../controller/productController";

router.post("/", productController.postProduct);

export default router;
