import { Token } from "../../../infraestructure/token/token";
import { NotFoundError } from "../errors/not-found-error";
import { HasherAndCompare } from "../../../infraestructure/cryptography/cryptography";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { DeliverymanRepository } from "../../../adapters/repositories/deliveryman-repository";
import { Either, failure, success } from "../../../utils/either";

type LoginDeliverymanUseCaseRequest = {
  email: string;
  password: string;
};

class LoginDeliverymanUseCase {
  constructor(
    private deliverymanRepository: DeliverymanRepository,
    private compare: HasherAndCompare,
    private token: Token
  ) {}

  public async execute({
    email,
    password,
  }: LoginDeliverymanUseCaseRequest): Promise<Either<NotFoundError | UnauthorizedError, string>> {
    const deliveryman = await this.deliverymanRepository.findByEmail(email);

    if (!deliveryman) {
      return failure(new NotFoundError(`Email incorreto`));
    }

    const checkPassword = await this.compare.compare(password, deliveryman.password);

    if (!checkPassword) {
      return failure(new UnauthorizedError(`Senha incorreta`));
    }

    const token = await this.token.sign({
      name: deliveryman.name,
      email: deliveryman.email,
      id_deliveryman: deliveryman.id,
    });

    return success(token);
  }
}

export { LoginDeliverymanUseCase };
