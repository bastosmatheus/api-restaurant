import { NotFoundError } from "../errors/not-found-error";
import { OrderRepository } from "../../../adapters/repositories/order-repository";
import { Order, StatusOrder } from "../../../core/entities/order";
import { Either, failure, success } from "../../../utils/either";

type UpdateStatusOrderUseCaseRequest = {
  id: string;
  status: StatusOrder;
};

class UpdateStatusOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  public async execute({
    id,
    status,
  }: UpdateStatusOrderUseCaseRequest): Promise<Either<NotFoundError, Order>> {
    const orderExists = await this.orderRepository.findById(id);

    if (!orderExists) {
      return failure(new NotFoundError(`Nenhum pedido encontrado com o ID: ${id}`));
    }

    const statusUpdated = orderExists.updateStatus(status);

    const order = await this.orderRepository.updateStatus(id, statusUpdated);

    return success(order);
  }
}

export { UpdateStatusOrderUseCase };
