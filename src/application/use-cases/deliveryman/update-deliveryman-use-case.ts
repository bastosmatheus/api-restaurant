import { Deliveryman } from "../../../core/entities/deliveryman";
import { NotFoundError } from "../errors/not-found-error";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { DeliverymanRepository } from "../../../adapters/repositories/deliveryman-repository";
import { Either, failure, success } from "../../../utils/either";

type UpdateDeliverymanUseCaseRequest = {
  id: string;
  name: string;
  id_deliveryman: string;
};

class UpdateDeliverymanUseCase {
  constructor(private deliverymanRepository: DeliverymanRepository) {}

  public async execute({
    id,
    name,
    id_deliveryman,
  }: UpdateDeliverymanUseCaseRequest): Promise<
    Either<NotFoundError | UnauthorizedError, Deliveryman>
  > {
    const deliverymanExists = await this.deliverymanRepository.findById(id);

    if (!deliverymanExists) {
      return failure(new NotFoundError(`Nenhum entregador encontrado com o ID: ${id}`));
    }

    if (id !== id_deliveryman) {
      return failure(
        new UnauthorizedError(`Você não tem permissão para atualizar esse entregador`)
      );
    }

    deliverymanExists.setName(name);

    const deliveryman = await this.deliverymanRepository.update(deliverymanExists);

    return success(deliveryman);
  }
}

export { UpdateDeliverymanUseCase };
