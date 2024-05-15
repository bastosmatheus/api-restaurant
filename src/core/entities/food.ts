import { randomUUID } from "crypto";

class Food {
  private constructor(
    public id: string,
    public food_name: string,
    public price: number,
    public description: string,
    public category: string,
    public image: string
  ) {}

  static create(
    food_name: string,
    price: number,
    description: string,
    category: string,
    image: string
  ) {
    const id = randomUUID();

    const food = new Food(id, food_name, price, description, category, image);

    return food;
  }
}

export { Food };
