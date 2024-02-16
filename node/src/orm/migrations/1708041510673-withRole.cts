import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class WithRole1708041510673 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "role", // Table name
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "name", type: "varchar" },
          { name: "password", type: "varchar" },
          { name: "read", type: "boolean" },
          { name: "write", type: "boolean" },
          { name: "control", type: "boolean" },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("role");
  }
}
