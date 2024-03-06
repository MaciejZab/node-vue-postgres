import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { SubcategoryEntity } from "./SubcategoryEntity";
import { DepartmentEntity } from "./DepartmentEntity";

@Entity()
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => DepartmentEntity, (department) => department.categories)
  department: DepartmentEntity;

  @OneToMany(() => SubcategoryEntity, (subcategory) => subcategory.category, { nullable: true })
  subcategories: SubcategoryEntity[];

  constructor(name: string, department: DepartmentEntity) {
    this.name = name;
    this.department = department;
  }
}
