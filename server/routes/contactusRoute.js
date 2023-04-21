import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import { contactUsController } from "../controllers/contactusController.js";

const router = express.Router();

//routes
//contactus
router.post(
  "/contact-us",
  requireSignIn,

  contactUsController
);

export default router;
