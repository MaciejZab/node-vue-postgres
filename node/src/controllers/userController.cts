import { Request, Response } from "express";
import { dataSource } from "../config/orm/dataSource.cjs";
import { User } from "../models/user/User.cjs";

const getUser = async (req: Request, res: Response) => {
  try {
    const user: User = await dataSource
      .getRepository(User)
      .createQueryBuilder("user")
      .where("user.username = :username", { username: req.body.username })
      .getOne();

    res.status(200).json({ user, message: "User found." });
  } catch (err) {
    res.status(404).json({ message: "Failed to retrieve user." });
  }
};

const userAuth = async (req: Request, res: Response) => {
  try {
    const user = new User(req.body);

    // Wait for LDAP authentication to complete
    await user.ldapAuthenticate();

    // Check if user exist in database
    const userExist: User = await dataSource
      .getRepository(User)
      .createQueryBuilder("user")
      .where("user.username = :username", { username: user.username })
      .getOne();

    // Create new User if these credentials doesn't exist in database
    if (!userExist) {
      await dataSource.getRepository(User).save(user);
      res.status(404).json({ message: "Authentication successful. User has been created." });
    } else {
      res.status(200).json({ userExist, message: "Authentication successful." });
    }
  } catch (err) {
    res.status(404).json({ message: "Invalid username or password." });
  }
};

export { getUser, userAuth };
