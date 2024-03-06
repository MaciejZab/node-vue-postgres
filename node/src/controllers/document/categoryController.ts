import { Request, Response } from "express";
import { dataSource } from "../../config/orm/dataSource";
import { CategoryEntity } from "../../orm/entity/document/CategoryEntity";
import { HttpResponseMessage } from "../../enums/response";
import { DepartmentEntity } from "../../orm/entity/document/DepartmentEntity";

const addCategory = async (req: Request, res: Response) => {
  try {
    const { name, departmentName } = req.body;

    const department = await dataSource
      .getRepository(DepartmentEntity)
      .findOne({ where: { name: departmentName } });

    if (!department) {
      return res.status(404).json({
        message: "Department not found",
        statusMessage: HttpResponseMessage.POST_ERROR,
      });
    }

    // Create a new category entity
    const added = new CategoryEntity(name, department);

    // Save the category entity to the database
    await dataSource.getRepository(CategoryEntity).save(added);

    // Send success response
    res.status(201).json({
      added,
      message: "Category added successfully",
      statusMessage: HttpResponseMessage.POST_SUCCESS,
    });
  } catch (error) {
    console.error("Error adding category: ", error);
    res.status(404).json({
      message: "Unknown error occurred. Failed to add category.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const editCategory = async (req: Request, res: Response) => {
  try {
    const { id, name } = req.body;

    // Find the category by id
    const category = await dataSource.getRepository(CategoryEntity).findOne(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        statusMessage: HttpResponseMessage.PUT_ERROR,
      });
    }

    category.name = name;

    // Save the updated category
    await dataSource.getRepository(CategoryEntity).save(category);

    // Send success response
    res.status(200).json({
      category,
      message: "Category updated successfully",
      statusMessage: HttpResponseMessage.PUT_SUCCESS,
    });
  } catch (error) {
    console.error("Error updating category: ", error);
    res.status(404).json({
      message: "Unknown error occurred. Failed to update category.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const removeCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    // Find the category by id
    const category = await dataSource.getRepository(CategoryEntity).findOne(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        statusMessage: HttpResponseMessage.DELETE_ERROR,
      });
    }

    // Remove the category
    await dataSource.getRepository(CategoryEntity).remove(category);

    // Send success response
    res.status(200).json({
      message: "Category removed successfully",
      statusMessage: HttpResponseMessage.DELETE_SUCCESS,
    });
  } catch (error) {
    console.error("Error removing category: ", error);
    res.status(404).json({
      message: "Unknown error occurred. Failed to remove category.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getAllCategories = async (req: Request, res: Response) => {
  try {
    // Fetch all categories from the database
    const categories = await dataSource.getRepository(CategoryEntity).find();

    // Send success response
    res.status(200).json({
      categories,
      message: "Categories retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving categories: ", error);
    res.status(404).json({
      message: "Unknown error occurred. Failed to retrieve categories.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getCatByDepName = async (req: Request, res: Response) => {
  try {
    const { depName } = req.body;

    const categories = await dataSource
      .getRepository(CategoryEntity)
      .createQueryBuilder("category_entity")
      .leftJoinAndSelect("category_entity.department", "category_entity_department")
      .where("department_entity.name = :depName", { depName })
      .getMany();

    // Send success response
    res.status(200).json({
      categories,
      message: "Categories retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving categories: ", error);
    res.status(404).json({
      message: "Unknown error occurred. Failed to retrieve categories.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export { addCategory, editCategory, removeCategory, getAllCategories, getCatByDepName };
