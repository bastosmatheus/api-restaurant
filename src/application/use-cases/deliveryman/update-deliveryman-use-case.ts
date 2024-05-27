import { Deliveryman } from "../../../core/entities/deliveryman";
import { NotFoundError } from "../errors/not-found-error";
import { DeliverymanRepository } from "../../../adapters/repositories/deliveryman-repository";
import { Either, failure, success } from "../../../utils/either";

type UpdateDeliverymanUseCaseRequest = {
  id: string;
  name: string;
};

class UpdateDeliverymanUseCase {
  constructor(private deliverymanRepository: DeliverymanRepository) {}

  public async execute({
    id,
    name,
  }: UpdateDeliverymanUseCaseRequest): Promise<Either<NotFoundError, Deliveryman>> {
    const deliverymanExists = await this.deliverymanRepository.findById(id);

    if (!deliverymanExists) {
      return failure(new NotFoundError(`Nenhum entregador encontrado com o ID: ${id}`));
    }

    deliverymanExists.setName(name);

    const deliveryman = await this.deliverymanRepository.update(deliverymanExists);

    return success(deliveryman);
  }
}

export { UpdateDeliverymanUseCase };
