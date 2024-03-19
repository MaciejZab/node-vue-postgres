interface DocumentEntity {
  id: number;
  ref: string;
  name: string;
  description: string;
  revision: number;
  subcategory: {
    name: string;
    id: number;
  };
  competence: string | null;
  languages: Array<string>;
}

export type { DocumentEntity };
