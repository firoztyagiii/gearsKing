import express from "express";
const router = express();

import * as reviewController from "../controller/reviewController";
import { protectRoute } from "../controller/authController";

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(protectRoute, reviewController.patchReview);
router.route("/").post(protectRoute, reviewController.postReview);

export default router;
