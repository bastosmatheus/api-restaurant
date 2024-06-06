import { OrderFoodRepository } from "../../../adapters/repositories/order-food-repository";

type FindOrdersFoodsByFoodUseCaseRequest = {
  id_food: string;
};

class FindOrdersFoodsByFoodUseCase {
  constructor(private orderFoodRepository: OrderFoodRepository) {}

  public async execute({ id_food }: FindOrdersFoodsByFoodUseCaseRequest) {
    const orderFood = await this.orderFoodRepository.findByFood(id_food);

    return orderFood;
  }
}

export { FindOrdersFoodsByFoodUseCase };
