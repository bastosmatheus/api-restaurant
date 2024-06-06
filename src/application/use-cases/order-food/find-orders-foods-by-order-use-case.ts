import { OrderFoodRepository } from "../../../adapters/repositories/order-food-repository";

type FindOrdersFoodsByOrderUseCaseRequest = {
  id_order: string;
};

class FindOrdersFoodsByOrderUseCase {
  constructor(private orderFoodRepository: OrderFoodRepository) {}

  public async execute({ id_order }: FindOrdersFoodsByOrderUseCaseRequest) {
    const orderFood = await this.orderFoodRepository.findByOrder(id_order);

    return orderFood;
  }
}

export { FindOrdersFoodsByOrderUseCase };
