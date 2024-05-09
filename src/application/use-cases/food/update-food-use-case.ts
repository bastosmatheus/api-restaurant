import { FoodRepository } from "../../../adapters/repositories/food-repository";
import { FoodPropsWithId, UpdateFoodUseCase } from "../../../interfaces/use-cases/food-use-case";

class UpdateFoodUseCaseImpl implements UpdateFoodUseCase {
  constructor(private foodRepository: FoodRepository) {}

  public async execute(props: FoodPropsWithId) {
    const food = await this.foodRepository.update(props);

    return food;
  }
}

export { UpdateFoodUseCaseImpl };
