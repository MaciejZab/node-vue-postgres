import express from "express";
import {
  addDepartment,
  editDepartment,
  getDepartments,
  removeDepartment,
} from "../controllers/document/departmentController";
import {
  addCategory,
  editCategory,
  removeCategory,
  getCategories,
} from "../controllers/document/categoryController";
import {
  addSubcategory,
  editSubcategory,
  getSubcategories,
  removeSubcategory,
} from "../controllers/document/subcategoryController";

const router = express.Router();

// Define routes
router.post("/department", addDepartment);
router.get("/department", getDepartments);
router.put("/department/:id/:name", editDepartment);
router.delete("/department/:id", removeDepartment);

router.post("/category", addCategory);
router.get("/category/:departmentName", getCategories);
router.put("/category/:id/:name", editCategory);
router.delete("/category/:id", removeCategory);

router.post("/subcategory", addSubcategory);
router.get("/subcategory/:departmentName/:categoryName", getSubcategories);
router.put("/subcategory/:id/:name", editSubcategory);
router.delete("/subcategory/:id", removeSubcategory);

export { router as documentRoutes };
