import { Food } from "../../../core/entities/food";
import { FoodRepository } from "../../../adapters/repositories/food-repository";
import { Either, failure, success } from "../../../utils/either";
import { NotFoundError } from "../errors/not-found-error";
import { ConflictError } from "../errors/conflict-error";

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
  }: UpdateFoodUseCaseRequest): Promise<Either<NotFoundError | ConflictError, Food>> {
    const foodExists = await this.foodRepository.findFoodById(id);

    if (!foodExists) {
      return failure(new NotFoundError(`Não existe nenhum alimento no cardápio com o ID ${id}`));
    }

    const foodNameAlreadyExists = await this.foodRepository.findFoodByName(food_name);

    if (foodNameAlreadyExists && foodNameAlreadyExists.id !== id) {
      return failure(new ConflictError(`${foodNameAlreadyExists.food_name} já existe no cardápio`));
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
