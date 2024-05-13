import { Food } from "../../core/entities/food";

type FoodWithId = {
  id: number;
} & Food;

interface FoodRepository {
  findAll(): Promise<Food[]>;
  findFoodById(id: number): Promise<FoodWithId>;
  create(food: Food): Promise<FoodWithId>;
  update(food: FoodWithId): Promise<FoodWithId>;
  delete(id: number): Promise<FoodWithId>;
}

export { FoodRepository };
