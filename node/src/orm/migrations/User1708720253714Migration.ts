import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class User1708720253714 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "user_entity",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "username", type: "varchar" },
          { name: "domain", type: "varchar" },
          { name: "permissionId", type: "int" },
          { name: "settingsId", type: "int" },
        ],
      })
    );

    await queryRunner.createTable(
      new Table({
        name: "user_permission_entity",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "read", type: "boolean" },
          { name: "write", type: "boolean" },
          { name: "control", type: "boolean" },
        ],
      })
    );

    await queryRunner.createTable(
      new Table({
        name: "user_settings_entity",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "theme", type: "varchar" },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "user_entity",
      new TableForeignKey({
        columnNames: ["permissionId"],
        referencedColumnNames: ["id"],
        referencedTableName: "user_permission_entity",
        onDelete: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "user_entity",
      new TableForeignKey({
        columnNames: ["settingsId"],
        referencedColumnNames: ["id"],
        referencedTableName: "user_settings_entity",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("user_entity");
    await queryRunner.dropTable("user_permission_entity");
    await queryRunner.dropTable("user_settings_entity");
  }
}
