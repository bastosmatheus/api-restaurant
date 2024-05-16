import { Food } from "../../../core/entities/food";
import { FoodRepository } from "../../../adapters/repositories/food-repository";
import { Either, failure, success } from "../../../utils/either";
import { NotFoundError } from "../errors/not-found-error";

type UpdateFoodUseCaseRequest = {
  id: string;
  food_name: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

class UpdateFoodUseCase {
  constructor(private foodRepository: FoodRepository) {}

  public async execute({
    id,
    food_name,
    price,
    description,
    category,
    image,
  }: UpdateFoodUseCaseRequest): Promise<Either<NotFoundError, Food>> {
    const foodExists = await this.foodRepository.findFoodById(id);

    if (!foodExists) {
      return failure(new NotFoundError(`Comida não encontrada com o ID: ${id}`));
    }

    const food = await this.foodRepository.update({
      id,
      food_name,
      price,
      description,
      category,
      image,
    });

    return success(food);
  }
}

export { UpdateFoodUseCase };
