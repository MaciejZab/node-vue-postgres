import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  read: boolean;

  @Column()
  write: boolean;

  @Column()
  control: boolean;
}
