import { Deliveryman } from "../../../core/entities/deliveryman";
import { NotFoundError } from "../errors/not-found-error";
import { HasherAndCompare } from "../../../infraestructure/cryptography/cryptography";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { DeliverymanRepository } from "../../../adapters/repositories/deliveryman-repository";
import { Either, failure, success } from "../../../utils/either";

type UpdatePasswordDeliverymanUseCaseRequest = {
  id: string;
  password: string;
  id_deliveryman: string;
};

class UpdatePasswordDeliverymanUseCase {
  constructor(
    private deliverymanRepository: DeliverymanRepository,
    private hasher: HasherAndCompare
  ) {}

  public async execute({
    id,
    password,
    id_deliveryman,
  }: UpdatePasswordDeliverymanUseCaseRequest): Promise<
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
