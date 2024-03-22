import { IChips } from "../../interfaces/document/IChips";

class Chips implements IChips {
  department: string;
  category: string;
  subcategory: string;

  constructor(department: string = "", category: string = "", subcategory: string = "") {
    this.department = department;
    this.category = category;
    this.subcategory = subcategory;
  }
}

export { Chips };
