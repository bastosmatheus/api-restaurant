import { Deliveryman } from "../../../core/entities/deliveryman";
import { NotFoundError } from "../errors/not-found-error";
import { DeliverymanRepository } from "../../../adapters/repositories/deliveryman-repository";
import { Either, failure, success } from "../../../utils/either";

type DeleteDeliverymanUseCaseRequest = {
  id: string;
};

class DeleteDeliverymanUseCase {
  constructor(private deliverymanRepository: DeliverymanRepository) {}

  public async execute({
    id,
  }: DeleteDeliverymanUseCaseRequest): Promise<Either<NotFoundError, Deliveryman>> {
    const deliverymanExists = await this.deliverymanRepository.findById(id);

    if (!deliverymanExists) {
      return failure(new NotFoundError(`Nenhum entregador encontrado com o ID: ${id}`));
    }

    const deliveryman = await this.deliverymanRepository.delete(id);

    return success(deliveryman);
  }
}

export { DeleteDeliverymanUseCase };
