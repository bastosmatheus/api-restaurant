import { Food } from "../../../core/entities/food";
import { FoodRepository } from "../../../adapters/repositories/food-repository";

type DeleteFoodUseCaseRequest = {
  id: number;
};

class DeleteFoodUseCase {
  constructor(private foodRepository: FoodRepository) {}

  public async execute(foodRequest: DeleteFoodUseCaseRequest): Promise<Food> {
    const food = await this.foodRepository.delete(foodRequest.id);

    return food;
  }
}

export { DeleteFoodUseCase };
