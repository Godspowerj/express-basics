import express from "express";
import dotenv from "dotenv";
import authenticateTOKEN from "./middleware/auth.js";
import startDB from "./config/db.js";
import authRouter from "./routes/authRouter.js";
import orderRouter from "./routes/orderRouter.js";
import productRouter from "./routes/productRouter.js";
import adminCheck from "./middleware/adminCheck.js";
import categoryRouter from "./routes/categoryRouter.js";
import { globalErrorHandler } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimit.js";
import helmet from "helmet";
import {
  initializePayment,
  verifyPayment,
} from "./controllers/paymentController.js";

export const app = express();
dotenv.config();
app.use(express.json());
startDB();

app.use(apiLimiter); // Applying rate limiting to all requests
app.use("/auth", authRouter);
app.use("/orders", orderRouter);
app.use("/products", productRouter);
app.use(
  "/admin",
  authenticateTOKEN,
  adminCheck,
  (await import("./routes/admin.js")).default
); // Lazy load the admin routes with authentication
app.use("/categories", categoryRouter);

// payment route
app.post("/payment/initialize", initializePayment);
app.get("/payment/verify/:reference", verifyPayment);

app.use(helmet()); // Set security-related HTTP headers


app.use(globalErrorHandler); // Global error handling middleware

if (process.env.NODE_ENV !== "test") {
  app.listen(process.env.PORT || 4000, () => {
    console.log(`✅ Server running on http://localhost:${process.env.PORT || 4000}`);
  });
}

