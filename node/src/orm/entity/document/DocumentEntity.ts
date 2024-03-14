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

  // constructor(document: IDocument, competence: Competence = null) {
  //   this.name = document.name;
  //   this.description = document.description;
  //   this.revision = document.revision;
  //   this.subcategory = document.subcategory;
  //   this.competence = competence;
  // }

  constructor(
    name: string,
    description: string,
    revision: number,
    subcategory: Subcategory,
    competence: Competence = null
  ) {
    this.name = name;
    this.description = description;
    this.revision = revision;
    this.subcategory = subcategory;
    this.competence = competence;
  }
}
