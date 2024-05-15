import { Food } from "../../../core/entities/food";
import { ConflictError } from "../errors/conflict-error";
import { Either, failure, success } from "../../../utils/either";
import { FoodRepository } from "../../../adapters/repositories/food-repository";

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

    if (foodNameAlreadyExists) {
      return failure(new ConflictError("Essa comida já existe"));
    }

    const foodCreated = Food.create(food_name, price, description, category, image);

    const id = foodCreated.id;

    const food = await this.foodRepository.create({
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

export { CreateFoodUseCase };
