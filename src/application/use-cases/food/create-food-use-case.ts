import { FoodRepository } from "../../../adapters/repositories/food-repository";
import { CreateFoodUseCase, FoodProps } from "../../../interfaces/use-cases/food-use-case";

class CreateFoodUseCaseImpl implements CreateFoodUseCase {
  constructor(private foodRepository: FoodRepository) {}

  public async execute(props: FoodProps): Promise<FoodProps> {
    const food = await this.foodRepository.create(props);

    return food;
  }
}

export { CreateFoodUseCaseImpl };
