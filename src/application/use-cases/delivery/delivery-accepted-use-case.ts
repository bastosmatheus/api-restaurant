import { Delivery } from "../../../core/entities/delivery";
import { NotFoundError } from "../errors/not-found-error";
import { DeliveryRepository } from "../../../adapters/repositories/delivery-repository";
import { DeliverymanRepository } from "../../../adapters/repositories/deliveryman-repository";
import { Either, failure, success } from "../../../utils/either";

type DeliveryAcceptedUseCaseRequest = {
  id: string;
  id_deliveryman: string;
};

class DeliveryAcceptedUseCase {
  constructor(
    private deliveryRepository: DeliveryRepository,
    private deliverymanRepository: DeliverymanRepository
  ) {}

  public async execute({
    id,
    id_deliveryman,
  }: DeliveryAcceptedUseCaseRequest): Promise<Either<NotFoundError, Delivery>> {
    const deliverymanExists = await this.deliverymanRepository.findById(id_deliveryman);

    if (!deliverymanExists) {
      return failure(new NotFoundError(`Nenhum entregador encontrado com o ID: ${id_deliveryman}`));
    }

    const deliveryExists = await this.deliveryRepository.findById(id);

    if (!deliveryExists) {
      return failure(new NotFoundError(`Nenhuma entrega encontrada com o ID: ${id}`));
    }

    deliveryExists.deliveryAccepted(id_deliveryman);

    const delivery = await this.deliveryRepository.deliveryAccepted(
      deliveryExists.id,
      deliveryExists.id_deliveryman as string
    );

    return success(delivery);
  }
}

export { DeliveryAcceptedUseCase };
