import { INewsEntity } from "../../interfaces/editor/INewsEntity";

class NewsEntity implements INewsEntity {
  id: number;
  ref: string;
  title: string;
  subtitle: string;
  content: string;

  constructor() {
    this.id = 0;
    this.ref = "";
    this.title = "";
    this.subtitle = "";
    this.content = `<div class="ck-override-vuetify-styles"></div><div></div>`;
  }
}

export { NewsEntity };
