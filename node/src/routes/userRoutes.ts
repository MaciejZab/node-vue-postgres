import express from "express";
import { getUser, userAuth } from "../controllers/userController";

const router = express.Router();

// Define routes
router.get("/", getUser);
router.post("/", userAuth);

export { router as userRoutes };
