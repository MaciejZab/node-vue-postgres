import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { CompetenceEntity } from "./CompetenceEntity";
import { SubcategoryEntity } from "./SubcategoryEntity";

@Entity()
export class DocumentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  revision: number;

  @ManyToOne(() => SubcategoryEntity, (subcategory) => subcategory.documents, { nullable: true })
  subcategory: SubcategoryEntity;

  @ManyToOne(() => CompetenceEntity, (competence) => competence.documents, { nullable: true })
  competence: CompetenceEntity;
}
