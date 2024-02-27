import { Request, Response } from "express";
import { dataSource } from "../config/orm/dataSource";
import { UserEntity } from "../orm/entity/user/UserEntity";
import { User } from "../models/user/User";
import { UserPermissionEntity } from "../orm/entity/user/UserPermissionEntity";
import { UserSettingsEntity } from "../orm/entity/user/UserSettingsEntity";

const findUser = async (username: string): Promise<UserEntity> => {
  return dataSource
    .getRepository(UserEntity)
    .createQueryBuilder("user_entity")
    .leftJoinAndSelect("user_entity.permission", "user_entity_permission")
    .leftJoinAndSelect("user_entity.settings", "user_entity_settings")
    .where("user_entity.username = :username", { username: username })
    .getOne();
};

const getUser = async (req: Request, res: Response) => {
  try {
    const user: UserEntity = await findUser(req.body.username);

    res.status(200).json({ user, message: "User found." });
  } catch (err) {
    console.log(err);
    res.status(404).json({ err, message: "Unknown error occurred. Failed to retrieve user." });
  }
};

const userAuth = async (req: Request, res: Response) => {
  try {
    const user = new User(req.body);
    console.log(user);

    // Wait for LDAP authentication to complete
    const authenticated = await user.ldapAuthenticate();

    if (!authenticated) res.status(204).json({ message: "Invalid username or password." });

    // Check if user exist in database
    let userExist: UserEntity | null = null;

    userExist = await findUser(user.username);

    // Create new UserEntity if user doesn't exist in database
    if (!userExist) {
      const permission = await dataSource
        .getRepository(UserPermissionEntity)
        .save(new UserPermissionEntity());

      const settings = await dataSource
        .getRepository(UserSettingsEntity)
        .save(new UserSettingsEntity());

      await dataSource
        .getRepository(UserEntity)
        .save(new UserEntity(user.username, user.domain, permission, settings));

      userExist = await findUser(user.username);

      res
        .status(201)
        .json({ userExist, message: "Authentication successful. User has been created." });
    } else {
      res.status(200).json({ userExist, message: "Authentication successful." });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({ err, message: "Unknown error occurred. Failed to authenticate user." });
  }
};

export { getUser, userAuth };
