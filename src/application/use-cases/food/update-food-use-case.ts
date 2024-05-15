import { Food } from "../../../core/entities/food";
import { FoodRepository } from "../../../adapters/repositories/food-repository";

type UpdateFoodUseCaseRequest = {
  id: string;
  foodName: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

class UpdateFoodUseCase {
  constructor(private foodRepository: FoodRepository) {}

  public async execute({
    id,
    foodName,
    price,
    description,
    category,
    image,
  }: UpdateFoodUseCaseRequest): Promise<Food | false> {
    const foodExists = await this.foodRepository.findFoodById(id);

    if (!foodExists) {
      return false;
    }

    const food = await this.foodRepository.update({
      id,
      foodName,
      price,
      description,
      category,
      image,
    });

    return food;
  }
}

export { UpdateFoodUseCase };
