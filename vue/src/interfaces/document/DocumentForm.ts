interface DocumentForm {
  name: string;
  description: string;
  revision: number;
  competence: string | null;
  departmentName: string;
  categoryName: string;
  subcategoryName: string;
}

export type { DocumentForm };
