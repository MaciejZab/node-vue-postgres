import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserPermissionEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  read: boolean;
  @Column()
  write: boolean;
  @Column()
  control: boolean;

  constructor(read: boolean, write: boolean, control: boolean) {
    this.read = read;
    this.write = write;
    this.control = control;
  }
}
