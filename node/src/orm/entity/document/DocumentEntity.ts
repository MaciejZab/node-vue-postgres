import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Competence } from "./CompetenceEntity";
import { Subcategory } from "./SubcategoryEntity";
import { IDocument } from "../../../interfaces/document/IDocument";

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  revision: number;

  @ManyToOne(() => Subcategory, (subcategory) => subcategory.documents)
  subcategory: Subcategory;

  @ManyToOne(() => Competence, (competence) => competence.documents, { nullable: true })
  competence: Competence;

  constructor(document: IDocument) {
    this.name = document.name;
    this.description = document.description;
    this.revision = document.revision;
    this.subcategory = document.subcategory;
  }
}
