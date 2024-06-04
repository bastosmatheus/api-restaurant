import { OrderRepository } from "../../../adapters/repositories/order-repository";

class FindOrdersByPixsUseCase {
  constructor(private orderRepository: OrderRepository) {}

  public async execute() {
    const orders = await this.orderRepository.findByPixs();

    return orders;
  }
}

export { FindOrdersByPixsUseCase };
