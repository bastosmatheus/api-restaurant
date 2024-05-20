import { Food } from "../../../core/entities/food";
import { FoodRepository } from "../../../adapters/repositories/food-repository";
import { NotFoundError } from "../errors/not-found-error";
import { Either, failure, success } from "../../../utils/either";

type FindFoodByNameUseCaseRequest = {
  food_name: string;
};

class FindFoodByNameUseCase {
  constructor(private foodRepository: FoodRepository) {}

  public async execute({
    food_name,
  }: FindFoodByNameUseCaseRequest): Promise<Either<NotFoundError, Food>> {
    const food = await this.foodRepository.findFoodByName(food_name);

    if (!food) {
      return failure(new NotFoundError(`${food_name} não existe no cardápio`));
    }

    return success(food);
  }
}

export { FindFoodByNameUseCase };
