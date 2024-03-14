import { Request, Response } from "express";
import { Document } from "../../orm/entity/document/DocumentEntity";
import { HttpResponseMessage } from "../../enums/response";
import { dataSource } from "../../config/orm/dataSource";
import { Subcategory } from "../../orm/entity/document/SubcategoryEntity";
// import { unlink } from "fs/promises";
import * as fs from "fs";
import * as path from "path";

const addDocument = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const base = JSON.parse(body.base);
    const files_langs = JSON.parse(body.files_langs);
    const uploadedFiles = req.files;

    uploadedFiles.forEach((file, index) => {
      const originalName = path.parse(file.originalname).name;
      const langs = files_langs[index].langs.join("_");

      // Construct new file name
      const newName = `${originalName}_${langs}${path.extname(file.originalname)}`;

      // Rename and move file to destination folder
      fs.renameSync(file.path, path.join(__dirname, "..", "..", "..", "uploads", newName));
    });

    const subcategory = await dataSource.getRepository(Subcategory).findOne({
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

    const document = new Document(base.name, base.description, base.revision, subcategory);

    const savedDocument = await dataSource.getRepository(Document).save(document);

    // Handle associated files

    res.status(201).json({
      added: savedDocument,
      message: "Document added successfully",
      statusMessage: HttpResponseMessage.POST_SUCCESS,
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

// const getDocument = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;

//     const document = await getRepository(Document).findOne(id);

//     if (!document) {
//       return res.status(404).json({
//         message: "Document not found",
//         statusMessage: HttpResponseMessage.GET_ERROR,
//       });
//     }

//     res.status(200).json({
//       document: document,
//       message: "Document retrieved successfully",
//       statusMessage: HttpResponseMessage.GET_SUCCESS,
//     });
//   } catch (error) {
//     console.error("Error retrieving document: ", error);
//     res.status(500).json({
//       message: "Failed to retrieve document.",
//       statusMessage: HttpResponseMessage.UNKNOWN,
//     });
//   }
// };

// export { addDocument, editDocument, removeDocument };
export { addDocument };
