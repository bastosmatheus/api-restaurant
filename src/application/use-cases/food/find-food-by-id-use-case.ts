import { FoodRepository } from "../../../adapters/repositories/food-repository";
import { FindFoodByIdUseCase } from "../../../interfaces/use-cases/food-use-case";

class FindFoodByIdImpl implements FindFoodByIdUseCase {
  constructor(private foodRepository: FoodRepository) {}

  public async execute(id: number) {
    const food = this.foodRepository.findFoodById(id);

    return food;
  }
}

export { FindFoodByIdImpl };
