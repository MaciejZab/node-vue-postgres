import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { UserPermissionEntity } from "./UserPermissionEntity";
import { UserSettingsEntity } from "./UserSettingsEntity";
import { User } from "../../../models/user/User";

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
  permission: UserPermissionEntity;

  @OneToOne(() => UserSettingsEntity)
  @JoinColumn()
  settings: UserSettingsEntity;

  constructor(
    username: string,
    domain: string,
    permission: UserPermissionEntity,
    settings: UserSettingsEntity
  ) {
    this.username = username;
    this.domain = domain;
    this.permission = permission;
    this.settings = settings;
  }
}
