import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { CategoryEntity } from "./CategoryEntity";
import { DocumentEntity } from "./DocumentEntity";

@Entity()
export class SubcategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => CategoryEntity, (category) => category.subcategories)
  category: CategoryEntity;

  @OneToMany(() => DocumentEntity, (document) => document.subcategory, { nullable: true })
  documents: DocumentEntity[];

  constructor(name: string, category: CategoryEntity) {
    this.name = name;
    this.category = category;
  }
}
