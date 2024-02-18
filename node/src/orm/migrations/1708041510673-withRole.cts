import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class WithRole1708041510673 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "role", // Table name
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "username", type: "varchar" },
          { name: "password", type: "varchar" },
          { name: "read", type: "boolean" },
          { name: "write", type: "boolean" },
          { name: "control", type: "boolean" },
        ],
      })
    );

    // Insert initial roles directly
    const roles = [
      { username: "Admin", password: "admin_password", read: true, write: true, control: true },
      { username: "Editor", password: "editor_password", read: true, write: true, control: false },
      { username: "Viewer", password: "viewer_password", read: true, write: false, control: false },
    ];

    for (const role of roles) {
      await queryRunner.manager.insert("role", role);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("role");
  }
}
