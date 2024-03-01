import { Request, Response } from "express";
import { dataSource } from "../../config/orm/dataSource";
import { Settings } from "../../models/user/Settings";
import { UserEntity } from "../../orm/entity/user/UserEntity";
import { UserSettingsEntity } from "../../orm/entity/user/UserSettingsEntity";
import { Permission } from "../../models/user/Permission";
import { IPermission } from "../../interfaces/user/IPermission";
import { UserPermissionEntity } from "../../orm/entity/user/UserPermissionEntity";
import { IUser } from "../../interfaces/user/IUser";

const findUser = async (id: number): Promise<UserEntity> => {
  return dataSource
    .getRepository(UserEntity)
    .createQueryBuilder("user_entity")
    .leftJoinAndSelect("user_entity.settings", "user_entity_settings")
    .where("user_entity.id = :id", { id: id })
    .getOne();
};

const setSettingsTheme = async (req: Request, res: Response) => {
  try {
    const settings = new Settings(req.body);

    const user = await findUser(settings.id);

    if (!user) return res.status(404).json({ message: "User settings not found." });

    const userSettings = user.settings;

    if (!userSettings) {
      return res.status(404).json({ message: "User settings not found." });
    }

    userSettings.theme = settings.theme;

    await dataSource.getRepository(UserSettingsEntity).save(userSettings);

    return res.status(200).json({ message: "Theme updated successfully." });
  } catch (error) {
    console.error("Error setting theme:", error);
    return res.status(404).json({ message: "Unknown error occurred. Failed to update theme." });
  }
};

const setSettingsPermission = async (req: Request, res: Response) => {
  // try {
  //   const { privilegeKey, user }: { privilegeKey: string; user: IUser } = req.body;
  //   let permission: IPermission;
  //   const moderatorPermission = {
  //     read: true,
  //     write: true,
  //     control: false,
  //   };
  //   const permissionEntity = new UserPermissionEntity(permission);
  //   const userEntity = await findUser(user.id);
  //   if (!userEntity) return res.status(404).json({ message: "User permission not found." });
  //   permissionEntity.id = userEntity.id;
  //   const userPermission = permissionEntity;
  //   await dataSource.getRepository(UserPermissionEntity).save(userPermission);
  //   return res.status(200).json({ message: "Permission updated successfully." });
  // } catch (error) {
  //   console.error("Error setting permission:", error);
  //   return res
  //     .status(404)
  //     .json({ message: "Unknown error occurred. Failed to update permission." });
  // }
};

export { setSettingsTheme };
