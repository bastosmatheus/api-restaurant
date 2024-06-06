import { OrderFoodRepository } from "../../../adapters/repositories/order-food-repository";

class FindAllOrdersFoodsUseCase {
  constructor(private orderFoodRepository: OrderFoodRepository) {}

  public async execute() {
    const orderFood = await this.orderFoodRepository.findAll();

    return orderFood;
  }
}

export { FindAllOrdersFoodsUseCase };
