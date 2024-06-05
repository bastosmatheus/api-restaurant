import { Delivery } from "../../../core/entities/delivery";
import { NotFoundError } from "../errors/not-found-error";
import { OrderRepository } from "../../../adapters/repositories/order-repository";
import { DeliveryRepository } from "../../../adapters/repositories/delivery-repository";
import { Either, failure, success } from "../../../utils/either";

type DeliveryCompletedUseCaseRequest = {
  id: string;
};

class DeliveryCompletedUseCase {
  constructor(
    private deliveryRepository: DeliveryRepository,
    private orderRepository: OrderRepository
  ) {}

  public async execute({
    id,
  }: DeliveryCompletedUseCaseRequest): Promise<Either<NotFoundError, Delivery>> {
    const deliveryExists = await this.deliveryRepository.findById(id);

    if (!deliveryExists) {
      return failure(new NotFoundError(`Nenhuma entrega encontrada com o ID: ${id}`));
    }

    const dateDeliveryCompleted = deliveryExists.deliveryCompleted();

    await this.orderRepository.updateStatus(deliveryExists.id_order, "Pedido concluido");

    const delivery = await this.deliveryRepository.deliveryCompleted(
      deliveryExists.id,
      dateDeliveryCompleted
    );

    return success(delivery);
  }
}

export { DeliveryCompletedUseCase };
