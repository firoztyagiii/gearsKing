import express from "express";
const router = express();

import * as reviewController from "../controller/reviewController";

router.post("/", reviewController.postReview);

export default router;
