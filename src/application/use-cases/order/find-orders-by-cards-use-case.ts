import { OrderRepository } from "../../../adapters/repositories/order-repository";

class FindOrdersByCardsUseCase {
  constructor(private orderRepository: OrderRepository) {}

  public async execute() {
    const orders = await this.orderRepository.findByCards();

    return orders;
  }
}

export { FindOrdersByCardsUseCase };
