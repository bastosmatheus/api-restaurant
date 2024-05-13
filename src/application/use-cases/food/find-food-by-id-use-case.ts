import { Food } from "../../../core/entities/food";
import { FoodRepository } from "../../../adapters/repositories/food-repository";

type FindFoodByIdUseCaseRequest = {
  id: number;
};

class FindFoodByIdUseCase {
  constructor(private foodRepository: FoodRepository) {}

  public async execute(foodRequest: FindFoodByIdUseCaseRequest): Promise<Food> {
    const food = this.foodRepository.findFoodById(foodRequest.id);

    return food;
  }
}

export { FindFoodByIdUseCase };
