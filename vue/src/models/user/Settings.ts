import { ISettings } from "../../interfaces/user/ISettings";

class Settings implements ISettings {
  id: number | null;
  theme: string;

  constructor(settings: ISettings) {
    this.id = settings.id;
    this.theme = settings.theme;
  }
}

export { Settings };
