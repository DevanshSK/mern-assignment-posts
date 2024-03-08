import { Router } from "express";

import { registerUser, loginUser, getUserInfo } from "../controllers/user.controller.js";
import verifyJwt from "../middlewares/verify.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/info", verifyJwt, getUserInfo);

export default router;