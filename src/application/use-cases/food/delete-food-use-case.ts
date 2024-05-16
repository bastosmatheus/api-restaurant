import { Food } from "../../../core/entities/food";
import { NotFoundError } from "../errors/not-found-error";
import { FoodRepository } from "../../../adapters/repositories/food-repository";
import { Either, failure, success } from "../../../utils/either";

type DeleteFoodUseCaseRequest = {
  id: string;
};

class DeleteFoodUseCase {
  constructor(private foodRepository: FoodRepository) {}

  public async execute({ id }: DeleteFoodUseCaseRequest): Promise<Either<NotFoundError, Food>> {
    const food = await this.foodRepository.delete(id);

    if (!food) {
      return failure(new NotFoundError(`Comida não encontrada com o ID: ${id}`));
    }

    return success(food);
  }
}

export { DeleteFoodUseCase };
