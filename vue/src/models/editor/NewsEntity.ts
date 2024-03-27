class NewsEntity {
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
    this.content = "";
  }
}

export { NewsEntity };
