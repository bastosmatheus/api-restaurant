import { Deliveryman } from "../../../core/entities/deliveryman";
import { NotFoundError } from "../errors/not-found-error";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { DeliverymanRepository } from "../../../adapters/repositories/deliveryman-repository";
import { Either, failure, success } from "../../../utils/either";

type DeleteDeliverymanUseCaseRequest = {
  id: string;
  id_deliveryman: string;
};

class DeleteDeliverymanUseCase {
  constructor(private deliverymanRepository: DeliverymanRepository) {}

  public async execute({
    id,
    id_deliveryman,
  }: DeleteDeliverymanUseCaseRequest): Promise<
    Either<NotFoundError | UnauthorizedError, Deliveryman>
  > {
    const deliverymanExists = await this.deliverymanRepository.findById(id);

    if (!deliverymanExists) {
      return failure(new NotFoundError(`Nenhum entregador encontrado com o ID: ${id}`));
    }

    if (id !== id_deliveryman) {
      return failure(new UnauthorizedError(`Você não tem permissão para excluir esse entregador`));
    }

    const deliveryman = await this.deliverymanRepository.delete(id);

    return success(deliveryman);
  }
}

export { DeleteDeliverymanUseCase };
