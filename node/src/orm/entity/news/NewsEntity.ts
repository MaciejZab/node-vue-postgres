import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ref: string;

  @Column()
  title: string;

  @Column()
  subtitle: string;

  @Column()
  content: string;

  constructor(ref: string = "", title: string = "", subtitle: string = "", content: string = "") {
    this.ref = ref;
    this.title = title;
    this.subtitle = subtitle;
    this.content = content;
  }
}
