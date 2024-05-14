import { Food } from "../../core/entities/food";

enum EFoodResponse {
  FoodNotFound,
  FoodNameAlreadyExits,
}

interface FoodRepository {
  findAll(): Promise<Food[]>;
  findFoodById(id: number): Promise<Food | EFoodResponse.FoodNotFound>;
  findFoodByName(foodName: string): Promise<Food | EFoodResponse.FoodNotFound>;
  create(foodRequest: Food): Promise<Food | EFoodResponse.FoodNameAlreadyExits>;
  update(
    foodRequest: Food
  ): Promise<Food | EFoodResponse.FoodNotFound | EFoodResponse.FoodNameAlreadyExits>;
  delete(id: number): Promise<Food | EFoodResponse.FoodNotFound>;
}

export { FoodRepository, EFoodResponse };
