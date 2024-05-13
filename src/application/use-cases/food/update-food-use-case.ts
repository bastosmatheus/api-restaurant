import { Food } from "../../../core/entities/food";
import { FoodRepository } from "../../../adapters/repositories/food-repository";

type UpdateFoodUseCaseRequest = {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

class UpdateFoodUseCase {
  constructor(private foodRepository: FoodRepository) {}

  public async execute(foodRequest: UpdateFoodUseCaseRequest): Promise<Food | false> {
    const foodExists = await this.foodRepository.findFoodById(foodRequest.id);

    if (!foodExists) {
      return false;
    }

    const food = await this.foodRepository.update(foodExists);

    return food;
  }
}

export { UpdateFoodUseCase };
