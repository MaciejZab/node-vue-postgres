import express from "express";
import { getRole, authRole } from "../controllers/roleController.cjs";

const router = express.Router();

// Define routes
router.get("/", getRole);
router.post("/", authRole);

export { router as roleRoutes };
