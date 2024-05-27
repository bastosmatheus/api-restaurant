import { Deliveryman } from "../../../core/entities/deliveryman";
import { NotFoundError } from "../errors/not-found-error";
import { DeliverymanRepository } from "../../../adapters/repositories/deliveryman-repository";
import { Either, failure, success } from "../../../utils/either";

type FindDeliverymanByIdUseCaseRequest = {
  id: string;
};

class FindDeliverymanByIdUseCase {
  constructor(private deliverymanRepository: DeliverymanRepository) {}

  public async execute({
    id,
  }: FindDeliverymanByIdUseCaseRequest): Promise<Either<NotFoundError, Deliveryman>> {
    const deliveryman = await this.deliverymanRepository.findById(id);

    if (!deliveryman) {
      return failure(new NotFoundError(`Nenhum entregador encontrado com o ID: ${id}`));
    }

    return success(deliveryman);
  }
}

export { FindDeliverymanByIdUseCase };
