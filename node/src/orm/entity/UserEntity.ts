import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { UserPermissionEntity } from "./UserPermissionEntity";

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  username: string;
  @Column()
  domain: string;

  @OneToOne(() => UserPermissionEntity)
  @JoinColumn()
  permissions: UserPermissionEntity;

  constructor(username: string, domain: string, permissions: UserPermissionEntity) {
    this.username = username;
    this.domain = domain;
    this.permissions = permissions;
  }
}
