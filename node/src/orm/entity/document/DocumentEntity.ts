import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Competence } from "./CompetenceEntity";
import { Subcategory } from "./SubcategoryEntity";

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

  @ManyToOne(() => Subcategory, (subcategory) => subcategory.documents, { nullable: true })
  subcategory: Subcategory;

  @ManyToOne(() => Competence, (competence) => competence.documents, { nullable: true })
  competence: Competence;
}
