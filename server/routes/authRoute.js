import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  resetPasswordController,
  getUserDashboardController,
  getAdminDashboardController,
  updatProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
} from "../controllers/authController.js";

import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", registerController);
//LOGIN || POST
router.post("/login", loginController);

//Forgot Password || POST
router.post("/forgot-password", forgotPasswordController);

//Reset Password || POST
router.post("/reset-password", resetPasswordController);

//test routes
router.get("/test", requireSignIn, isAdmin, testController);

//protected User route auth
router.get("/user-auth", requireSignIn, getUserDashboardController);

//protected Admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, getAdminDashboardController);

//update user profile
router.put("/profile", requireSignIn, updatProfileController);

//orders
router.get("/orders", requireSignIn, getOrdersController);

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

//order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

export default router;
