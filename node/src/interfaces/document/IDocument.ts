import { Competence } from "../../orm/entity/document/CompetenceEntity";
import { Subcategory } from "../../orm/entity/document/SubcategoryEntity";

interface IDocument {
  name: string;
  description: string;
  revision: number;
  subcategory: Subcategory;
  competence: Competence;
}

export type { IDocument };
