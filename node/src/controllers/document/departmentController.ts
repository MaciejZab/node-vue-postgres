import { Request, Response } from "express";
import { dataSource } from "../../config/orm/dataSource";
import { DepartmentEntity } from "../../orm/entity/document/DepartmentEntity";
import { HttpResponseMessage } from "../../enums/response";

const addDepartment = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const added = new DepartmentEntity(name);

    await dataSource.getRepository(DepartmentEntity).save(added);

    res.status(201).json({
      added,
      message: "Department added successfully",
      statusMessage: HttpResponseMessage.POST_SUCCESS,
    });
  } catch (error) {
    console.error("Error adding department: ", error);
    res.status(404).json({
      message: "Unknown error occurred. Failed to add department.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const editDepartment = async (req: Request, res: Response) => {
  try {
    const { id, name } = req.body;

    const department = await dataSource.getRepository(DepartmentEntity).findOne(id);

    if (!department) {
      return res.status(404).json({
        message: "Department not found",
        statusMessage: HttpResponseMessage.PUT_ERROR,
      });
    }

    department.name = name;

    await dataSource.getRepository(DepartmentEntity).save(department);

    res.status(200).json({
      department,
      message: "Department updated successfully",
      statusMessage: HttpResponseMessage.PUT_SUCCESS,
    });
  } catch (error) {
    console.error("Error updating department: ", error);
    res.status(404).json({
      message: "Unknown error occurred. Failed to update department.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const removeDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    const department = await dataSource.getRepository(DepartmentEntity).findOne(id);

    if (!department) {
      return res.status(404).json({
        message: "Department not found",
        statusMessage: HttpResponseMessage.DELETE_ERROR,
      });
    }

    await dataSource.getRepository(DepartmentEntity).remove(department);

    res.status(200).json({
      message: "Department removed successfully",
      statusMessage: HttpResponseMessage.DELETE_SUCCESS,
    });
  } catch (error) {
    console.error("Error removing department: ", error);
    res.status(404).json({
      message: "Unknown error occurred. Failed to remove department.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getAllDepartments = async (req: Request, res: Response) => {
  try {
    const departments = await dataSource.getRepository(DepartmentEntity).find();

    res.status(200).json({
      departments,
      message: "Departments retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving departments: ", error);
    res.status(404).json({
      message: "Unknown error occurred. Failed to retrieve departments.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export { addDepartment, editDepartment, removeDepartment, getAllDepartments };
