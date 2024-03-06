import express from "express";
import { getUser, userAuth } from "../controllers/user/userController";
import { setSettingsLanguage, setSettingsTheme } from "../controllers/user/settingsController";

const router = express.Router();

// Define routes
router.get("/", getUser);
router.post("/", userAuth);

router.put("/settings/theme", setSettingsTheme);
router.put("/settings/language", setSettingsLanguage);
// router.post("/settings/permission", setSettingsPermission);

export { router as userRoutes };
