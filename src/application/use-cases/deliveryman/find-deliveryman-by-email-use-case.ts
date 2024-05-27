import { Deliveryman } from "../../../core/entities/deliveryman";
import { NotFoundError } from "../errors/not-found-error";
import { DeliverymanRepository } from "../../../adapters/repositories/deliveryman-repository";
import { Either, failure, success } from "../../../utils/either";

type FindDeliverymanByEmailUseCaseRequest = {
  email: string;
};

class FindDeliverymanByEmailUseCase {
  constructor(private deliverymanRepository: DeliverymanRepository) {}

  public async execute({
    email,
  }: FindDeliverymanByEmailUseCaseRequest): Promise<Either<NotFoundError, Deliveryman>> {
    const deliveryman = await this.deliverymanRepository.findByEmail(email);

    if (!deliveryman) {
      return failure(new NotFoundError(`Nenhum entregador encontrado com o email: ${email}`));
    }

    return success(deliveryman);
  }
}

export { FindDeliverymanByEmailUseCase };
