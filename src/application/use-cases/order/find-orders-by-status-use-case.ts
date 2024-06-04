import { StatusOrder } from "../../../core/entities/order";
import { OrderRepository } from "../../../adapters/repositories/order-repository";

type FindOrdersByStatusUseCaseRequest = {
  status: StatusOrder;
};

class FindOrdersByStatusUseCase {
  constructor(private orderRepository: OrderRepository) {}

  public async execute({ status }: FindOrdersByStatusUseCaseRequest) {
    const orders = await this.orderRepository.findByStatus(status);

    return orders;
  }
}

export { FindOrdersByStatusUseCase };
