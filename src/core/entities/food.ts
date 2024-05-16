import { randomUUID } from "crypto";

class Food {
  public id: string;
  constructor(
    public food_name: string,
    public price: number,
    public description: string,
    public category: string,
    public image: string
  ) {
    this.id = randomUUID();
  }
}

export { Food };
