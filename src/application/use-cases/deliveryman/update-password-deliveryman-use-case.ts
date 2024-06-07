import { Deliveryman } from "../../../core/entities/deliveryman";
import { NotFoundError } from "../errors/not-found-error";
import { HasherAndCompare } from "../../../infraestructure/cryptography/cryptography";
import { DeliverymanRepository } from "../../../adapters/repositories/deliveryman-repository";
import { Either, failure, success } from "../../../utils/either";

type UpdatePasswordDeliverymanUseCaseRequest = {
  id: string;
  password: string;
};

class UpdatePasswordDeliverymanUseCase {
  constructor(
    private deliverymanRepository: DeliverymanRepository,
    private hasher: HasherAndCompare
  ) {}

  public async execute({
    id,
    password,
  }: UpdatePasswordDeliverymanUseCaseRequest): Promise<Either<NotFoundError, Deliveryman>> {
    const deliverymanExists = await this.deliverymanRepository.findById(id);

    if (!deliverymanExists) {
      return failure(new NotFoundError(`Nenhum entregador encontrado com o ID: ${id}`));
    }

    const passwordHashed = await this.hasher.hash(password);

    deliverymanExists.setPassword(passwordHashed);

    const deliveryman = await this.deliverymanRepository.updatePassword(
      deliverymanExists.id,
      deliverymanExists.password
    );

    return success(deliveryman);
  }
}

export { UpdatePasswordDeliverymanUseCase };
