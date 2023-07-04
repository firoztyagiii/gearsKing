import express from "express";
const router = express.Router();

import * as userController from "../controller/userController";
import * as authController from "../controller/authController";

router.post("/signup", userController.signUp);
router.post("/login", userController.login);
router.post("/forget-password", authController.forgetPassword);
router.post("/reset-password", authController.resetPassword);

export default router;
