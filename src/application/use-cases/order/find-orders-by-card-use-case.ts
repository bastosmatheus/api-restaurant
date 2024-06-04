import { OrderRepository } from "../../../adapters/repositories/order-repository";

type FindOrdersByCardsUseCaseRequest = {
  id_card: string;
};

class FindOrdersByCardUseCase {
  constructor(private orderRepository: OrderRepository) {}

  public async execute({ id_card }: FindOrdersByCardsUseCaseRequest) {
    const orders = await this.orderRepository.findByCard(id_card);

    return orders;
  }
}

export { FindOrdersByCardUseCase };
