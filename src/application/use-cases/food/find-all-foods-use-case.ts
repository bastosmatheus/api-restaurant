import { Food } from "../../../core/entities/food";
import { FoodRepository } from "../../../adapters/repositories/food-repository";

class FindAllFoodsUseCase {
  constructor(private foodRepository: FoodRepository) {}

  public async execute(): Promise<Food[]> {
    const foods = await this.foodRepository.findAll();

    return foods;
  }
}

export { FindAllFoodsUseCase };
