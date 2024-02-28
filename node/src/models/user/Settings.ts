import { ISettings } from "../../interfaces/user/ISettings";

class Settings implements ISettings {
  id: number | null;
  theme: string;

  constructor(settings: ISettings | null = null) {
    this.id = settings?.id ?? null;
    this.theme = settings?.theme ?? "light";
  }
}

export { Settings };
