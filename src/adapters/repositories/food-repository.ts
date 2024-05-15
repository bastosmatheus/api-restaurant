import { Food } from "../../core/entities/food";

interface FoodRepository {
  findAll(): Promise<Food[]>;
  findFoodById(id: string): Promise<Food | null>;
  findFoodByName(food_name: string): Promise<Food | null>;
  create(foodRequest: Food): Promise<Food>;
  update(foodRequest: Food): Promise<Food | null>;
  delete(id: string): Promise<Food | null>;
}

export { FoodRepository };
