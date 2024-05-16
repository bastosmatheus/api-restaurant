import { Food } from "../../../core/entities/food";
import { ConflictError } from "../errors/conflict-error";
import { FoodRepository } from "../../../adapters/repositories/food-repository";
import { Either, failure, success } from "../../../utils/either";

type CreateFoodUseCaseRequest = {
  food_name: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

class CreateFoodUseCase {
  constructor(private foodRepository: FoodRepository) {}

  public async execute({
    food_name,
    price,
    description,
    category,
    image,
  }: CreateFoodUseCaseRequest): Promise<Either<ConflictError, Food>> {
    const foodNameAlreadyExists = await this.foodRepository.findFoodByName(food_name);
    console.log(foodNameAlreadyExists);

    if (foodNameAlreadyExists) {
      return failure(new ConflictError(`Esse nome ${foodNameAlreadyExists.food_name} já existe`));
    }

    const foodCreated = new Food(food_name, price, description, category, image);

    const food = await this.foodRepository.create(foodCreated);

    return success(foodCreated);
  }
}

export { CreateFoodUseCase };
