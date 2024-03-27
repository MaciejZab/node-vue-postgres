import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Editor1711454048711 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "news",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "ref",
            type: "varchar",
          },
          {
            name: "title",
            type: "varchar",
          },
          {
            name: "subtitle",
            type: "varchar",
          },
          {
            name: "content",
            type: "text",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("news");
  }
}
