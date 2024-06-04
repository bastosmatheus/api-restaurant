import { OrderRepository } from "../../../adapters/repositories/order-repository";

type FindOrdersByUserUseCaseRequest = {
  id_user: string;
};

class FindOrdersByUserUseCase {
  constructor(private orderRepository: OrderRepository) {}

  public async execute({ id_user }: FindOrdersByUserUseCaseRequest) {
    const orders = await this.orderRepository.findByUser(id_user);

    return orders;
  }
}

export { FindOrdersByUserUseCase };
