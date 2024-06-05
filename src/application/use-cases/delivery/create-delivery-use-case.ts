import { Delivery } from "../../../core/entities/delivery";
import { NotFoundError } from "../errors/not-found-error";
import { OrderRepository } from "../../../adapters/repositories/order-repository";
import { DeliveryRepository } from "../../../adapters/repositories/delivery-repository";
import { Either, failure, success } from "../../../utils/either";

type CreateDeliveryUseCaseRequest = {
  id_order: string;
};

class CreateDeliveryUseCase {
  constructor(
    private deliveryRepository: DeliveryRepository,
    private orderRepository: OrderRepository
  ) {}

  public async execute({
    id_order,
  }: CreateDeliveryUseCaseRequest): Promise<Either<NotFoundError, Delivery>> {
    const orderExists = await this.orderRepository.findById(id_order);

    if (!orderExists) {
      return failure(new NotFoundError(`Nenhum pedido encontrado com o ID: ${id_order}`));
    }

    const deliveryCreated = Delivery.create(id_order);

    const delivery = await this.deliveryRepository.create(deliveryCreated);

    return success(delivery);
  }
}

export { CreateDeliveryUseCase };
