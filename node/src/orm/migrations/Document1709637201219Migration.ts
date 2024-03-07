import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class Document1709637201219 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create Department Entity
    await queryRunner.createTable(
      new Table({
        name: "department",
        columns: [
          {
            name: "id",
            type: "serial",
            isPrimary: true,
          },
          {
            name: "name",
            type: "varchar",
            isNullable: false,
            isUnique: true,
          },
        ],
      }),
      true
    );

    // Create Category Entity
    await queryRunner.createTable(
      new Table({
        name: "category",
        columns: [
          {
            name: "id",
            type: "serial",
            isPrimary: true,
          },
          {
            name: "name",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "departmentId",
            type: "int",
          },
        ],
      }),
      true
    );

    // Create Subcategory Entity
    await queryRunner.createTable(
      new Table({
        name: "subcategory",
        columns: [
          {
            name: "id",
            type: "serial",
            isPrimary: true,
          },
          {
            name: "name",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "categoryId",
            type: "int",
            isNullable: true,
          },
        ],
      }),
      true
    );

    // Create Document Entity
    await queryRunner.createTable(
      new Table({
        name: "document",
        columns: [
          {
            name: "id",
            type: "serial",
            isPrimary: true,
          },
          {
            name: "name",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "description",
            type: "text",
            isNullable: true,
          },
          {
            name: "revision",
            type: "int",
            isNullable: false,
          },
          {
            name: "subcategoryId",
            type: "int",
            isNullable: true,
          },
          {
            name: "competenceId",
            type: "int",
            isNullable: true,
          },
        ],
      }),
      true
    );

    // Create Competence Entity
    await queryRunner.createTable(
      new Table({
        name: "competence",
        columns: [
          {
            name: "id",
            type: "serial",
            isPrimary: true,
          },
          {
            name: "name",
            type: "varchar",
            isNullable: false,
          },
        ],
      }),
      true
    );

    // Add Foreign Keys
    await queryRunner.createForeignKey(
      "category",
      new TableForeignKey({
        columnNames: ["departmentId"],
        referencedColumnNames: ["id"],
        referencedTableName: "department",
      })
    );

    await queryRunner.createForeignKey(
      "subcategory",
      new TableForeignKey({
        columnNames: ["categoryId"],
        referencedColumnNames: ["id"],
        referencedTableName: "category",
      })
    );

    await queryRunner.createForeignKey(
      "document",
      new TableForeignKey({
        columnNames: ["subcategoryId"],
        referencedColumnNames: ["id"],
        referencedTableName: "subcategory",
      })
    );

    await queryRunner.createForeignKey(
      "document",
      new TableForeignKey({
        columnNames: ["competenceId"],
        referencedColumnNames: ["id"],
        referencedTableName: "competence",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("document");
    await queryRunner.dropTable("competence");
    await queryRunner.dropTable("subcategory");
    await queryRunner.dropTable("category");
    await queryRunner.dropTable("department");
  }
}
