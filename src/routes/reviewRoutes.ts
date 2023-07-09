import express from "express";
const router = express();

import * as reviewController from "../controller/reviewController";
import { protectRoute } from "../controller/authController";

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(protectRoute, reviewController.patchReview)
  .delete(protectRoute, reviewController.deleteReview);

router
  .route("/")
  .get(reviewController.getReviews)
  .post(protectRoute, reviewController.postReview);

export default router;
