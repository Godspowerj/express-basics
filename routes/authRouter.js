import express from "express";
import { SignupController, LoginController } from "../controllers/authcontroller.js";
const router = express.Router();
import { apiLimiter } from "../middleware/rateLimit.js";

// Define your auth routes here, for example:
router.post("/signup" , apiLimiter , SignupController); 
router.post("/login" , LoginController);

export default router;