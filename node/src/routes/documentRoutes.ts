import express from "express";
import {
  addDepartment,
  editDepartment,
  getAllDepartments,
  removeDepartment,
} from "../controllers/document/departmentController";
import {
  addCategory,
  editCategory,
  getAllCategories,
  removeCategory,
  getCatByDepName,
} from "../controllers/document/categoryController";
import {
  addSubcategory,
  editSubcategory,
  getAllSubcategories,
  removeSubcategory,
  getSubcategoriesByDepartmentAndCategoryName,
} from "../controllers/document/subcategoryController";

const router = express.Router();

// Define routes
router.post("/department", addDepartment);
router.get("/department", getAllDepartments);
router.put("/department", editDepartment);
router.delete("/department", removeDepartment);

router.post("/category", addCategory);
router.get("/category", getAllCategories);
router.get("/category/byDepName", getCatByDepName);
router.put("/category", editCategory);
router.delete("/category", removeCategory);

router.post("/subcategory", addSubcategory);
router.get("/subcategory", getAllSubcategories);
router.get("/subcategory/byDepCatName", getSubcategoriesByDepartmentAndCategoryName);
router.put("/subcategory", editSubcategory);
router.delete("/subcategory", removeSubcategory);

export { router as documentRoutes };
