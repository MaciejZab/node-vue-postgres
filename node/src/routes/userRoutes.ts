import express from "express";
import { getUser, userAuth } from "../controllers/user/userController";
import { setSettingsTheme } from "../controllers/user/settingsController";

const router = express.Router();

// Define routes
router.get("/", getUser);
router.post("/", userAuth);

router.post("/settings/theme", setSettingsTheme);
// router.post("/settings/permission", setSettingsPermission);

export { router as userRoutes };
