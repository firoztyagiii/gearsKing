import express from "express";
const router = express.Router();

import * as userController from "../controller/userController";

router.post("/signup", userController.signUp);
router.post("/login", userController.login);

export default router;
