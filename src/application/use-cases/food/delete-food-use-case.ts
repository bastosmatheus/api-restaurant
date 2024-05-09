import { FoodRepository } from "../../../adapters/repositories/food-repository";
import { DeleteFoodUseCase, FoodPropsWithId } from "../../../interfaces/use-cases/food-use-case";

class DeleteFoodUseCaseImpl implements DeleteFoodUseCase {
  constructor(private foodRepository: FoodRepository) {}

  public async execute(id: number): Promise<FoodPropsWithId> {
    const food = await this.foodRepository.findFoodById(id);

    return food;
  }
}

export { DeleteFoodUseCaseImpl };
