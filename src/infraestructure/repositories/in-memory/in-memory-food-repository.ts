import { Food } from "../../../core/entities/food";
import { FoodRepository } from "../../../adapters/repositories/food-repository";

class InMemoryFoodRepository implements FoodRepository {
  private foods: Food[] = [];

  public async findAll(): Promise<Food[]> {
    return this.foods;
  }

  public async findByCategory(category: string): Promise<Food[]> {
    const food = this.foods.filter((food) => food.category === category);

    return food;
  }

  public async findById(id: string): Promise<Food | null> {
    const food = this.foods.find((food) => food.id === id);

    if (!food) {
      return null;
    }

    return Food.restore(
      food.id,
      food.food_name,
      food.price,
      food.description,
      food.category,
      food.image
    );
  }

  public async findByName(food_name: string): Promise<Food | null> {
    const food = this.foods.find((food) => food.food_name === food_name);

    if (!food) {
      return null;
    }

    return Food.restore(
      food.id,
      food.food_name,
      food.price,
      food.description,
      food.category,
      food.image
    );
  }

  public async create(food: Food): Promise<Food> {
    this.foods.push(food);

    return food;
  }

  public async update(food: Food): Promise<Food> {
    const foodIndex = this.foods.findIndex((food) => food.id === food.id);

    this.foods[foodIndex].food_name = food.food_name;
    this.foods[foodIndex].price = food.price;
    this.foods[foodIndex].description = food.description;
    this.foods[foodIndex].category = food.category;
    this.foods[foodIndex].image = food.image;

    return this.foods[foodIndex];
  }

  public async delete(id: string): Promise<Food> {
    const foodIndex = this.foods.findIndex((food) => food.id === id);

    this.foods.pop();

    return this.foods[foodIndex];
  }
}

export { InMemoryFoodRepository };
