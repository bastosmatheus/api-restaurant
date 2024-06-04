import { Order } from "../../../core/entities/order";
import { NotFoundError } from "../errors/not-found-error";
import { OrderRepository } from "../../../adapters/repositories/order-repository";
import { Either, failure, success } from "../../../utils/either";

type FindOrderByIdUseCaseRequest = {
  id: string;
};

class FindOrderByIdUseCase {
  constructor(private orderRepository: OrderRepository) {}

  public async execute({ id }: FindOrderByIdUseCaseRequest): Promise<Either<NotFoundError, Order>> {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      return failure(new NotFoundError(`Nenhum pedido encontrado com o ID: ${id}`));
    }

    return success(order);
  }
}

export { FindOrderByIdUseCase };
