import { authenticate } from "ldap-authentication";
import { Login } from "../../interfaces/user/Login.cjs";

class User {
  readonly id: number;
  readonly username: string;
  readonly domain: string;
  readonly password: string;

  constructor(login: Login) {
    this.username = login.username;
    this.domain = login.domain;
    this.password = login.password;
  }

  public ldapAuthenticate = async (): Promise<any> => {
    const ldapHost = `ldap://${this.domain}`;
    const options = {
      ldapOpts: { url: ldapHost },
      userDn: `${this.username}@${this.domain}`,
      userPassword: this.password,
    };

    return authenticate(options);
  };
}

export { User };
