import { Food } from "../../../core/entities/food";
import { EFoodResponse, FoodRepository } from "../../../adapters/repositories/food-repository";
import { Either, failure, success } from "../../../utils/either";
import { ConflictError } from "../errors/conflict-error";

type CreateFoodUseCaseRequest = {
  foodName: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

class CreateFoodUseCase {
  constructor(private foodRepository: FoodRepository) {}

  public async execute(
    foodRequest: CreateFoodUseCaseRequest
  ): Promise<Either<ConflictError, Food>> {
    const foodCreated = Food.create(
      foodRequest.foodName,
      foodRequest.price,
      foodRequest.description,
      foodRequest.category,
      foodRequest.image
    );

    const food = await this.foodRepository.create(foodCreated);

    if (food === EFoodResponse.FoodNameAlreadyExits) {
      return failure(new ConflictError("Essa comida já existe"));
    }

    return success(food);
  }
}

export { CreateFoodUseCase };
