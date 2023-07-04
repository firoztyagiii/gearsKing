import express from "express";
const router = express.Router();

import * as userController from "../controller/userController";
import * as authController from "../controller/authController";

router.route("/signup").post(userController.signUp);
router.route("/login").post(userController.login);
router.route("/forget-password").post(authController.forgetPassword);
router.route("/reset-password").post(authController.resetPassword);
router
  .route("/about-me")
  .get(authController.protectRoute, userController.aboutMe);

export default router;
