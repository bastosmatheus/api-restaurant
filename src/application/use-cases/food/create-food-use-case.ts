import { Food } from "../../../core/entities/food";
import { FoodRepository } from "../../../adapters/repositories/food-repository";

type CreateFoodUseCaseRequest = {
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

class CreateFoodUseCase {
  constructor(private foodRepository: FoodRepository) {}

  public async execute(foodRequest: CreateFoodUseCaseRequest): Promise<Food> {
    const foodCreated = Food.create(
      foodRequest.name,
      foodRequest.price,
      foodRequest.description,
      foodRequest.category,
      foodRequest.image
    );

    const food = await this.foodRepository.create(foodCreated);

    return food;
  }
}

export { CreateFoodUseCase };
