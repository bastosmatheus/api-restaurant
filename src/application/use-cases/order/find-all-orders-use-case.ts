import { OrderRepository } from "../../../adapters/repositories/order-repository";

class FindAllOrdersUseCase {
  constructor(private orderRepository: OrderRepository) {}

  public async execute() {
    const orders = await this.orderRepository.findAll();

    return orders;
  }
}

export { FindAllOrdersUseCase };
