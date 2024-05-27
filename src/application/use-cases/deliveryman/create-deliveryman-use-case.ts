import { Deliveryman } from "../../../core/entities/deliveryman";
import { ConflictError } from "../errors/conflict-error";
import { Either, failure, success } from "../../../utils/either";
import { DeliverymanRepository } from "../../../adapters/repositories/deliveryman-repository";
import { Hasher } from "../../../infraestructure/cryptography/cryptography";

type CreateDeliverymanUseCaseRequest = {
  name: string;
  email: string;
  password: string;
  birthday_date: Date;
};

class CreateDeliverymanUseCase {
  constructor(
    private deliverymanRepository: DeliverymanRepository,
    private hasher: Hasher
  ) {}

  public async execute({
    name,
    email,
    password,
    birthday_date,
  }: CreateDeliverymanUseCaseRequest): Promise<Either<ConflictError, Deliveryman>> {
    const emailAlreadyExists = await this.deliverymanRepository.findByEmail(email);

    if (emailAlreadyExists) {
      return failure(new ConflictError(`Esse email já está em uso`));
    }

    const passwordHashed = await this.hasher.hash(password);

    const deliverymanCreated = Deliveryman.create(name, email, passwordHashed, birthday_date);

    const deliveryman = await this.deliverymanRepository.create(deliverymanCreated);

    return success(deliveryman);
  }
}

export { CreateDeliverymanUseCase };
