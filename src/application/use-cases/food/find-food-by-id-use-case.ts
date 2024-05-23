import { Food } from "../../../core/entities/food";
import { NotFoundError } from "../errors/not-found-error";
import { FoodRepository } from "../../../adapters/repositories/food-repository";
import { Either, failure, success } from "../../../utils/either";

type FindFoodByIdUseCaseRequest = {
  id: string;
};

class FindFoodByIdUseCase {
  constructor(private foodRepository: FoodRepository) {}

  public async execute({ id }: FindFoodByIdUseCaseRequest): Promise<Either<NotFoundError, Food>> {
    const food = await this.foodRepository.findFoodById(id);

    if (!food) {
      return failure(new NotFoundError(`Nenhum alimento encontrado com o ID: ${id}`));
    }

    return success(food);
  }
}

export { FindFoodByIdUseCase };
