import { Token } from "../../../infraestructure/token/token";
import { NotFoundError } from "../errors/not-found-error";
import { UserRepository } from "../../../adapters/repositories/user-repository";
import { HasherAndCompare } from "../../../infraestructure/cryptography/cryptography";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { Either, failure, success } from "../../../utils/either";

type LoginUserUseCaseRequest = {
  email: string;
  password: string;
};

class LoginUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private compare: HasherAndCompare,
    private token: Token
  ) {}

  public async execute({
    email,
    password,
  }: LoginUserUseCaseRequest): Promise<Either<NotFoundError | UnauthorizedError, string>> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return failure(new NotFoundError(`Email incorreto`));
    }

    const checkPassword = await this.compare.compare(password, user.password);

    if (!checkPassword) {
      return failure(new UnauthorizedError(`Senha incorreta`));
    }

    const token = await this.token.sign({
      name: user.name,
      email: user.email,
      id_user: user.id,
    });

    return success(token);
  }
}

export { LoginUserUseCase };
