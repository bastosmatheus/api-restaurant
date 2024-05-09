import { FoodRepository } from "../../../adapters/repositories/food-repository";
import { FindAllFoodsUseCase, FoodProps } from "../../../interfaces/use-cases/food-use-case";

class FindAllFoodsUseCaseImpl implements FindAllFoodsUseCase {
  constructor(private foodRepository: FoodRepository) {}

  public async execute(): Promise<FoodProps[]> {
    const food = await this.foodRepository.findAll();

    return food;
  }
}

export { FindAllFoodsUseCaseImpl };
