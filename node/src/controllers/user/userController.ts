import { Request, Response } from "express";
import { dataSource } from "../../config/orm/dataSource";
import { UserEntity } from "../../orm/entity/user/UserEntity";
import { User } from "../../models/user/User";
import { UserPermissionEntity } from "../../orm/entity/user/UserPermissionEntity";
import { UserSettingsEntity } from "../../orm/entity/user/UserSettingsEntity";
import { adminsConfig } from "../../config/admins";
import { HttpResponseMessage } from "../../enums/response";

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

    if (!user)
      res
        .status(404)
        .json({ user, message: "User not found.", statusMessage: HttpResponseMessage.GET_ERROR });

    res
      .status(200)
      .json({ user, message: "User found.", statusMessage: HttpResponseMessage.GET_SUCCESS });
  } catch (err) {
    console.error("Error retrieving user:", err);
    res.status(404).json({
      err,
      message: "Unknown error occurred. Failed to retrieve user.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getUsers = async (req: Request, res: Response) => {
  try {
    const users: Array<UserEntity> = await dataSource
      .getRepository(UserEntity)
      .find({ relations: ["languages"] });

    // if (!user)
    //   res
    //     .status(404)
    //     .json({ user, message: "User not found.", statusMessage: HttpResponseMessage.GET_ERROR });

    // res
    //   .status(200)
    //   .json({ user, message: "User found.", statusMessage: HttpResponseMessage.GET_SUCCESS });
  } catch (err) {
    console.error("Error retrieving user:", err);
    res.status(404).json({
      err,
      message: "Unknown error occurred. Failed to retrieve user.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const userAuth = async (req: Request, res: Response) => {
  try {
    const user = new User(req.body);

    // Wait for LDAP authentication to complete
    const authenticated = await user.ldapAuthenticate();

    if (!authenticated)
      res.status(204).json({
        message: "Invalid username or password.",
        statusMessage: HttpResponseMessage.POST_ERROR,
      });

    // Check if user exist in database
    let userExist: UserEntity | null = null;

    userExist = await findUser(user.username);

    // Create new UserEntity if user doesn't exist in database
    if (!userExist) {
      const admins = adminsConfig.admins;
      const adminPermission = {
        read: true,
        write: true,
        control: true,
      };

      const permissionEntity: UserPermissionEntity = admins.includes(user.username)
        ? new UserPermissionEntity(adminPermission)
        : new UserPermissionEntity();

      const permission = await dataSource
        .getRepository(UserPermissionEntity)
        .save(permissionEntity);

      const settings = await dataSource
        .getRepository(UserSettingsEntity)
        .save(new UserSettingsEntity());

      await dataSource
        .getRepository(UserEntity)
        .save(new UserEntity(user.username, user.domain, permission, settings));

      userExist = await findUser(user.username);

      res.status(201).json({
        userExist,
        message: "Authentication successful. User has been created.",
        statusMessage: HttpResponseMessage.POST_SUCCESS,
      });
    } else {
      res.status(200).json({
        userExist,
        message: "Authentication successful.",
        statusMessage: HttpResponseMessage.POST_SUCCESS,
      });
    }
  } catch (err) {
    console.error("Error authenticating user: ", err);
    res.status(404).json({
      message: "Unknown error occurred. Failed to authenticate user.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export { getUser, userAuth };
