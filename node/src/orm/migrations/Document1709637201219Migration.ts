import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class Document1709637201219 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create Department Entity
    await queryRunner.createTable(
      new Table({
        name: "department_entity",
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
        name: "category_entity",
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
        name: "subcategory_entity",
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
        name: "document_entity",
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
        name: "competence_entity",
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
      "category_entity",
      new TableForeignKey({
        columnNames: ["departmentId"],
        referencedColumnNames: ["id"],
        referencedTableName: "department_entity",
      })
    );

    await queryRunner.createForeignKey(
      "subcategory_entity",
      new TableForeignKey({
        columnNames: ["categoryId"],
        referencedColumnNames: ["id"],
        referencedTableName: "category_entity",
      })
    );

    await queryRunner.createForeignKey(
      "document_entity",
      new TableForeignKey({
        columnNames: ["subcategoryId"],
        referencedColumnNames: ["id"],
        referencedTableName: "subcategory_entity",
      })
    );

    await queryRunner.createForeignKey(
      "document_entity",
      new TableForeignKey({
        columnNames: ["competenceId"],
        referencedColumnNames: ["id"],
        referencedTableName: "competence_entity",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("document_entity");
    await queryRunner.dropTable("document_competence_entity");
    await queryRunner.dropTable("document_subcategory_entity");
    await queryRunner.dropTable("document_category_entity");
    await queryRunner.dropTable("department_entity");
  }
}
