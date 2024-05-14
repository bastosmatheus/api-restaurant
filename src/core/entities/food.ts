import { randomUUID } from "crypto";

class Food {
  private constructor(
    public id: string,
    public foodName: string,
    public price: number,
    public description: string,
    public category: string,
    public image: string
  ) {}

  static create(
    foodName: string,
    price: number,
    description: string,
    category: string,
    image: string
  ) {
    const id = randomUUID();

    const food = new Food(id, foodName, price, description, category, image);

    return food;
  }
}

export { Food };
