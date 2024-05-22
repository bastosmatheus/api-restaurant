import { Food } from "../../../core/entities/food";
import { FoodRepository } from "../../../adapters/repositories/food-repository";

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

    return Food.restore(
      food.id,
      food.food_name,
      food.price,
      food.description,
      food.category,
      food.image
    );
  }

  public async findFoodByName(food_name: string): Promise<Food | null> {
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

  public async create({ food_name, price, description, category, image }: Food): Promise<Food> {
    const food = Food.create(food_name, price, description, category, image);

    this.foods.push(food);

    return food;
  }

  public async update({ id, food_name, price, description, category, image }: Food): Promise<Food> {
    const foodIndex = this.foods.findIndex((food) => food.id === id);

    this.foods[foodIndex].setFoodName(food_name);
    this.foods[foodIndex].setPrice(price);
    this.foods[foodIndex].setDescription(description);
    this.foods[foodIndex].setCategory(category);
    this.foods[foodIndex].setImage(image);

    return this.foods[foodIndex];
  }

  public async delete(id: string): Promise<Food> {
    const foodIndex = this.foods.findIndex((food) => food.id === id);

    this.foods.pop();

    return this.foods[foodIndex];
  }
}

export { InMemoryFoodRepository };
