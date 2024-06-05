import { Delivery } from "../../../core/entities/delivery";
import { NotFoundError } from "../errors/not-found-error";
import { DeliveryRepository } from "../../../adapters/repositories/delivery-repository";
import { Either, failure, success } from "../../../utils/either";

type DeliveryCompletedUseCaseRequest = {
  id: string;
};

class DeliveryCompletedUseCase {
  constructor(private deliveryRepository: DeliveryRepository) {}

  public async execute({
    id,
  }: DeliveryCompletedUseCaseRequest): Promise<Either<NotFoundError, Delivery>> {
    const deliveryExists = await this.deliveryRepository.findById(id);

    if (!deliveryExists) {
      return failure(new NotFoundError(`Nenhuma entrega encontrada com o ID: ${id}`));
    }

    deliveryExists.deliveryCompleted();

    const delivery = await this.deliveryRepository.deliveryCompleted(deliveryExists.id);

    return success(delivery);
  }
}

export { DeliveryCompletedUseCase };
