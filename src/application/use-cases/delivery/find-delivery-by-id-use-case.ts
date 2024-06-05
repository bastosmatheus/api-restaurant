import { Delivery } from "../../../core/entities/delivery";
import { NotFoundError } from "../errors/not-found-error";
import { DeliveryRepository } from "../../../adapters/repositories/delivery-repository";
import { Either, failure, success } from "../../../utils/either";

type FindDeliveryByIdUseCaseRequest = {
  id: string;
};

class FindDeliveryByIdUseCase {
  constructor(private deliveryRepository: DeliveryRepository) {}

  public async execute({
    id,
  }: FindDeliveryByIdUseCaseRequest): Promise<Either<NotFoundError, Delivery>> {
    const delivery = await this.deliveryRepository.findById(id);

    if (!delivery) {
      return failure(new NotFoundError(`Nenhuma entrega encontrada com o ID: ${id}`));
    }

    return success(delivery);
  }
}

export { FindDeliveryByIdUseCase };
