import { ISettings } from "../../interfaces/user/ISettings";

class Settings implements ISettings {
  theme: string;

  constructor(settings: ISettings | null = null) {
    this.theme = settings?.theme ?? "light";
  }
}

export { Settings };
