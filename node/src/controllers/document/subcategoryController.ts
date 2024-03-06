import { Request, Response } from "express";
import { dataSource } from "../../config/orm/dataSource";
import { HttpResponseMessage } from "../../enums/response";
import { SubcategoryEntity } from "../../orm/entity/document/SubcategoryEntity";
import { CategoryEntity } from "../../orm/entity/document/CategoryEntity";

const addSubcategory = async (req: Request, res: Response) => {
  try {
    const { name, categoryName, departmentName } = req.body;

    const category = await dataSource
      .getRepository(CategoryEntity)
      .findOne({ where: { name: categoryName, department: { name: departmentName } } });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        statusMessage: HttpResponseMessage.POST_ERROR,
      });
    }

    // Create a new subcategory entity
    const added = new SubcategoryEntity(name, category);

    // Save the subcategory entity to the database
    await dataSource.getRepository(SubcategoryEntity).save(added);

    // Send success response
    res.status(201).json({
      added,
      message: "Subcategory added successfully",
      statusMessage: HttpResponseMessage.POST_SUCCESS,
    });
  } catch (error) {
    console.error("Error adding subcategory: ", error);
    res.status(404).json({
      message: "Unknown error occurred. Failed to add subcategory.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const editSubcategory = async (req: Request, res: Response) => {
  try {
    const { id, name } = req.body;

    // Find the subcategory by id
    const subcategory = await dataSource.getRepository(SubcategoryEntity).findOne(id);

    if (!subcategory) {
      return res.status(404).json({
        message: "Subcategory not found",
        statusMessage: HttpResponseMessage.PUT_ERROR,
      });
    }

    subcategory.name = name;

    // Save the updated subcategory
    await dataSource.getRepository(SubcategoryEntity).save(subcategory);

    // Send success response
    res.status(200).json({
      subcategory,
      message: "Subcategory updated successfully",
      statusMessage: HttpResponseMessage.PUT_SUCCESS,
    });
  } catch (error) {
    console.error("Error updating subcategory: ", error);
    res.status(404).json({
      message: "Unknown error occurred. Failed to update subcategory.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const removeSubcategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    // Find the subcategory by id
    const subcategory = await dataSource.getRepository(SubcategoryEntity).findOne(id);

    if (!subcategory) {
      return res.status(404).json({
        message: "Subcategory not found",
        statusMessage: HttpResponseMessage.DELETE_ERROR,
      });
    }

    // Remove the subcategory
    await dataSource.getRepository(SubcategoryEntity).remove(subcategory);

    // Send success response
    res.status(200).json({
      message: "Subcategory removed successfully",
      statusMessage: HttpResponseMessage.DELETE_SUCCESS,
    });
  } catch (error) {
    console.error("Error removing subcategory: ", error);
    res.status(404).json({
      message: "Unknown error occurred. Failed to remove subcategory.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getAllSubcategories = async (req: Request, res: Response) => {
  try {
    // Fetch all subcategories from the database
    const subcategories = await dataSource.getRepository(SubcategoryEntity).find();

    // Send success response
    res.status(200).json({
      subcategories,
      message: "Subcategories retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving subcategories: ", error);
    res.status(404).json({
      message: "Unknown error occurred. Failed to retrieve subcategories.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getSubcategoriesByDepartmentAndCategoryName = async (req: Request, res: Response) => {
  try {
    const { departmentName, categoryName } = req.body;

    const subcategories = await dataSource
      .getRepository(SubcategoryEntity)
      .createQueryBuilder("subcategory")
      .leftJoin("subcategory.category", "category")
      .leftJoin("category.department", "department")
      .where("department.name = :departmentName", { departmentName })
      .andWhere("category.name = :categoryName", { categoryName })
      .getMany();

    // Send success response
    res.status(200).json({
      subcategories,
      message: "Subcategories retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving subcategories: ", error);
    res.status(404).json({
      message: "Unknown error occurred. Failed to retrieve subcategories.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export {
  addSubcategory,
  editSubcategory,
  removeSubcategory,
  getAllSubcategories,
  getSubcategoriesByDepartmentAndCategoryName,
};
