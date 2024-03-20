import { Request, Response } from "express";
import { Document } from "../../orm/entity/document/DocumentEntity";
import { HttpResponseMessage } from "../../enums/response";
import { dataSource } from "../../config/orm/dataSource";
import { Subcategory } from "../../orm/entity/document/SubcategoryEntity";
import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import { Language } from "../../orm/entity/document/LanguageEntity";
import { Department } from "../../orm/entity/document/DepartmentEntity";
import { Category } from "../../orm/entity/document/CategoryEntity";
import { In } from "typeorm";

const addDocument = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const base = JSON.parse(body.base);
    const files_langs = JSON.parse(body.files_langs);
    const uploadedFiles = req.files;

    await dataSource.transaction(async (transactionalEntityManager) => {
      const subcategory = await transactionalEntityManager.getRepository(Subcategory).findOne({
        where: {
          name: base.subcategoryName,
          category: {
            name: base.categoryName,
            department: {
              name: base.departmentName,
            },
          },
        },
      });

      const document = new Document(
        uuidv4(),
        base.name,
        base.description,
        base.revision,
        subcategory
      );

      const savedDocument = await transactionalEntityManager.getRepository(Document).save(document);

      // const languageEntities: Array<Language> = [];

      for (const [index, file] of uploadedFiles.entries()) {
        const originalName = path.parse(file.originalname).name;
        const languageName = files_langs[index].langs.join("_");

        const savedLanguage = await transactionalEntityManager
          .getRepository(Language)
          .save(new Language(languageName, savedDocument));

        // languageEntities.push(savedLanguage);

        const params = {
          langs: savedLanguage.name,
          uuid: savedDocument.ref,
        };

        const queryString = new URLSearchParams(params).toString();

        // Construct new file name
        const newName = `${savedDocument.name}_qs_${queryString}${path.extname(file.originalname)}`;

        // Rename and move file to destination folder
        fs.renameSync(
          file.path,
          path.join(__dirname, "..", "..", "..", "uploads", "documents", newName)
        );
      }

      // savedDocument.languages = languageEntities;
      // await transactionalEntityManager.getRepository(Document).save(savedDocument);

      res.status(201).json({
        added: JSON.stringify(savedDocument),
        message: "Document added successfully",
        statusMessage: HttpResponseMessage.POST_SUCCESS,
      });
    });
  } catch (error) {
    console.error("Error adding document: ", error);
    res.status(404).json({
      message: "Failed to add document.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

// const editDocument = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { name, description, revision, subcategory, competence, languages } = req.body;

//     const document = await getRepository(Document).findOne(id);

//     if (!document) {
//       return res.status(404).json({
//         message: "Document not found",
//         statusMessage: HttpResponseMessage.PUT_ERROR,
//       });
//     }

//     document.name = name;
//     document.description = description;
//     document.revision = revision;
//     document.subcategory = subcategory;
//     document.competence = competence;

//     const updatedDocument = await getRepository(Document).save(document);

//     // Handle associated files here if needed

//     res.status(200).json({
//       edited: updatedDocument,
//       message: "Document updated successfully",
//       statusMessage: HttpResponseMessage.PUT_SUCCESS,
//     });
//   } catch (error) {
//     console.error("Error updating document: ", error);
//     res.status(500).json({
//       message: "Failed to update document.",
//       statusMessage: HttpResponseMessage.UNKNOWN,
//     });
//   }
// };

// const removeDocument = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;

//     const documentRepository = getRepository(Document);
//     const document = await documentRepository.findOne(id);

//     if (!document) {
//       return res.status(404).json({
//         message: "Document not found",
//         statusMessage: HttpResponseMessage.DELETE_ERROR,
//       });
//     }

//     // Delete associated files here if needed
//     // Example: Delete files stored on disk
//     // Assuming each document has a unique filename stored in a 'filePath' property
//     await Promise.all(
//       document.languages.map((language) => {
//         if (language.location) {
//           return unlink(language.location); // Delete the file associated with the document
//         }
//       })
//     );

//     await documentRepository.remove(document);

//     res.status(200).json({
//       removed: document,
//       message: "Document removed successfully",
//       statusMessage: HttpResponseMessage.DELETE_SUCCESS,
//     });
//   } catch (error) {
//     console.error("Error removing document: ", error);
//     res.status(500).json({
//       message: "Failed to remove document.",
//       statusMessage: HttpResponseMessage.UNKNOWN,
//     });
//   }
// };

const getDocuments = async (_req: Request, res: Response) => {
  try {
    const docs = await dataSource.getRepository(Document).find({ relations: ["languages"] });

    if (!docs) {
      return res.status(404).json({
        message: "Documents not found",
        statusMessage: HttpResponseMessage.GET_ERROR,
      });
    }

    // Add languages array to each document record
    const documents = docs.map((document) => {
      return {
        ...document,
        languages: document.languages.map((language) => language.name),
      };
    });

    res.status(200).json({
      documents: documents,
      message: "Documents retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving documents: ", error);
    res.status(404).json({
      message: "Failed to retrieve documents.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getDocumentsByDep = async (req: Request, res: Response) => {
  try {
    const { departmentName } = req.params;

    const depOptions = {
      where: {
        name: departmentName,
      },
    };
    const departmentEntity = await dataSource.getRepository(Department).find(depOptions);

    if (!departmentEntity) {
      return res.status(404).json({
        message: "Department not found",
        statusMessage: HttpResponseMessage.GET_ERROR,
      });
    }

    const docOptions = {
      where: {
        subcategory: {
          category: {
            department: departmentEntity,
          },
        },
      },
      relations: ["languages"],
    };

    const docs = await dataSource.getRepository(Document).find(docOptions);

    if (!docs) {
      return res.status(404).json({
        message: "Documents not found",
        statusMessage: HttpResponseMessage.GET_ERROR,
      });
    }

    const documents = docs.map((document) => {
      return {
        ...document,
        languages: document.languages.map((language) => language.name),
      };
    });

    res.status(200).json({
      documents: documents,
      message: "Documents retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving documents: ", error);
    res.status(404).json({
      message: "Failed to retrieve documents.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getDocumentsByDepCat = async (req: Request, res: Response) => {
  try {
    const { departmentName, categoryName } = req.params;

    const depOptions = {
      where: {
        name: departmentName,
      },
    };
    const departmentEntity = await dataSource.getRepository(Department).find(depOptions);

    if (!departmentEntity) {
      return res.status(404).json({
        message: "Department not found",
        statusMessage: HttpResponseMessage.GET_ERROR,
      });
    }

    const catOptions = {
      where: {
        name: categoryName,
        department: departmentEntity,
      },
    };
    const categoryEntity = await dataSource.getRepository(Category).find(catOptions);

    if (!categoryEntity) {
      return res.status(404).json({
        message: "Category not found",
        statusMessage: HttpResponseMessage.GET_ERROR,
      });
    }

    const subOptions = {
      where: {
        category: categoryEntity,
      },
    };
    const subcategories = await dataSource.getRepository(Subcategory).find(subOptions);

    // Extract subcategory IDs to use in the document query
    const subcategoryIds = subcategories.map((subcategory) => subcategory.id);

    const docOptions = {
      where: {
        subcategory: In(subcategoryIds),
      },
      relations: ["languages"],
    };
    const docs = await dataSource.getRepository(Document).find(docOptions);

    if (!docs) {
      return res.status(404).json({
        message: "Documents not found",
        statusMessage: HttpResponseMessage.GET_ERROR,
      });
    }

    const documents = docs.map((document) => {
      return {
        ...document,
        languages: document.languages.map((language) => language.name),
      };
    });

    res.status(200).json({
      documents: documents,
      message: "Documents retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving documents: ", error);
    res.status(404).json({
      message: "Failed to retrieve documents.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getDocumentsByDepCatSub = async (req: Request, res: Response) => {
  try {
    const { departmentName, categoryName, subcategoryName } = req.params;
    const depOptions = {
      where: {
        name: departmentName,
      },
    };
    const departmentEntity = await dataSource.getRepository(Department).find(depOptions);
    if (!departmentEntity) {
      return res.status(404).json({
        message: "Department not found",
        statusMessage: HttpResponseMessage.GET_ERROR,
      });
    }

    const catOptions = {
      relations: {
        department: true,
      },
      where: {
        name: categoryName,
        department: departmentEntity,
      },
    };
    const categoryEntity = await dataSource.getRepository(Category).find(catOptions);
    if (!categoryEntity) {
      return res.status(404).json({
        message: "Category not found",
        statusMessage: HttpResponseMessage.GET_ERROR,
      });
    }

    const subOptions = {
      relations: {
        category: {
          department: true,
        },
      },
      where: {
        name: subcategoryName,
        category: categoryEntity,
      },
    };
    const subcategoryEntity = await dataSource.getRepository(Subcategory).find(subOptions);
    const docOptions = {
      where: {
        subcategory: subcategoryEntity,
      },
      relations: ["languages"],
    };
    const docs = await dataSource.getRepository(Document).find(docOptions);

    if (!docs) {
      return res.status(404).json({
        message: "Documents not found",
        statusMessage: HttpResponseMessage.GET_ERROR,
      });
    }

    const documents = docs.map((document) => {
      return {
        ...document,
        languages: document.languages.map((language) => language.name),
      };
    });

    res.status(200).json({
      documents: documents,
      message: "Documents retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving documents: ", error);
    res.status(404).json({
      message: "Failed to retrieve documents.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

// export { addDocument, editDocument, removeDocument };
export {
  addDocument,
  getDocuments,
  getDocumentsByDep,
  getDocumentsByDepCat,
  getDocumentsByDepCatSub,
};
