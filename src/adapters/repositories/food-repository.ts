import { Food } from "../../core/entities/food";

interface FoodRepository {
  findAll(): Promise<Food[]>;
  findFoodById(id: string): Promise<Food | null>;
  findFoodByName(food_name: string): Promise<Food | null>;
  create(food: Food): Promise<Food>;
  update(food: Food): Promise<Food>;
  delete(id: string): Promise<Food>;
}

export { FoodRepository };
