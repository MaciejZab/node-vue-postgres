import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { DocumentEntity } from "./DocumentEntity";

@Entity()
export class CompetenceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => DocumentEntity, (document) => document.competence, { nullable: true })
  documents: DocumentEntity[];
}
