import { randomUUID } from "crypto";

class Food {
  constructor(
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

    return new Food(id, food_name, price, description, category, image);
  }

  static restore(
    id: string,
    food_name: string,
    price: number,
    description: string,
    category: string,
    image: string
  ) {
    return new Food(id, food_name, price, description, category, image);
  }

  public getFoodName() {
    return this.food_name;
  }

  public getPrice() {
    return this.price;
  }

  public getDescription() {
    return this.description;
  }

  public getCategory() {
    return this.category;
  }

  public getImage() {
    return this.image;
  }

  public setFoodName(name: string) {
    this.food_name = name;
  }

  public setPrice(price: number) {
    this.price = price;
  }

  public setDescription(description: string) {
    this.description = description;
  }

  public setCategory(category: string) {
    this.category = category;
  }

  public setImage(image: string) {
    this.image = image;
  }
}

export { Food };
