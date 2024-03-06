import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { CategoryEntity } from "./CategoryEntity";

@Entity()
export class DepartmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => CategoryEntity, (category) => category.department, { nullable: true })
  categories: CategoryEntity[];

  constructor(name: string) {
    this.name = name;
  }
}
