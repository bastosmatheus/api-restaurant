import { FoodRepository } from "../../../adapters/repositories/food-repository";
import { Food } from "../../../core/entities/food";

class InMemoryFoodRepository implements FoodRepository {
  private foods: Food[] = [];

  public async findAll(): Promise<Food[]> {
    return this.foods;
  }

  public async findFoodsByCategory(category: string): Promise<Food[]> {
    const food = this.foods.filter((food) => food.category === category);

    return food;
  }

  public async findFoodById(id: string): Promise<Food | null> {
    const food = this.foods.find((food) => food.id === id);

    if (!food) {
      return null;
    }

    return food;
  }

  public async findFoodByName(food_name: string): Promise<Food | null> {
    const food = this.foods.find((food) => food.food_name === food_name);

    if (!food) {
      return null;
    }

    return food;
  }

  public async create({ food_name, price, description, category, image }: Food): Promise<Food> {
    const food = new Food(food_name, price, description, category, image);

    this.foods.push(food);

    return food;
  }

  public async update({ id, food_name, price, description, category, image }: Food): Promise<Food> {
    const foodIndex = this.foods.findIndex((food) => food.id === id);

    this.foods[foodIndex].food_name = food_name;
    this.foods[foodIndex].price = price;
    this.foods[foodIndex].description = description;
    this.foods[foodIndex].category = category;
    this.foods[foodIndex].image = image;

    return this.foods[foodIndex];
  }

  public async delete(id: string): Promise<Food> {
    const foodIndex = this.foods.findIndex((food) => food.id === id);

    this.foods.pop();

    return this.foods[foodIndex];
  }
}

export { InMemoryFoodRepository };
