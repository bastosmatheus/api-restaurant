import { Food } from "../../../core/entities/food";
import { FoodRepository } from "../../../adapters/repositories/food-repository";

type FindFoodsByCategoryUseCaseRequest = {
  category: string;
};

class FindFoodsByCategoryUseCase {
  constructor(private readonly foodRepository: FoodRepository) {}

  public async execute({ category }: FindFoodsByCategoryUseCaseRequest): Promise<Food[]> {
    const foods = await this.foodRepository.findByCategory(category);

    return foods;
  }
}

export { FindFoodsByCategoryUseCase };
