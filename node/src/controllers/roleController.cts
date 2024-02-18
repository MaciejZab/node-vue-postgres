import { Request, Response } from "express";
import { dataSource } from "../config/orm/dataSource.cjs";
import { Role } from "../orm/entity/role.entity.cjs";

const getRole = async (req: Request, res: Response) => {
  try {
    const { name }: { name: string } = req.body; // Access name from request body

    const roles: Role = await dataSource
      .getRepository(Role)
      .createQueryBuilder("role")
      .where("role.name = :name", { name })
      .getOne();

    res.json(roles); // Send all matching roles
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve roles" });
  }
};

const authRole = async (req: Request, res: Response) => {
  try {
    const { username, password }: { username: string; password: string } = req.body;
    console.log(username, password);

    const role: Role | undefined = await dataSource
      .getRepository(Role)
      .createQueryBuilder("role")
      .where("role.username = :username", { username })
      .andWhere("role.password = :password", { password })
      .getOne();

    if (role) {
      res.json(role); // Send role data if authorized
    } else {
      res.json(false); // Send false if authorization fails
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to authenticate role" });
  }
};

export { getRole, authRole };
