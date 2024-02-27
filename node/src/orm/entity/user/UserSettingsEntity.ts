import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { ISettings } from "../../../interfaces/user/ISettings";

@Entity()
export class UserSettingsEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  theme: string;

  constructor(settings: ISettings | null = null) {
    this.theme = settings?.theme ?? "light";
  }
}
