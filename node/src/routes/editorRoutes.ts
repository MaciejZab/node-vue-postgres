import express from "express";
import multer from "multer";

import { addNews, getNews } from "../controllers/editor/newsController";

const router = express.Router();
const upload = multer({ dest: `${__dirname}/../../uploads/news` });
// Define routes

router.post("/news", upload.any(), addNews);
router.get("/news", getNews);

export { router as editorRoutes };
