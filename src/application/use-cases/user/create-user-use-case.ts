import { User } from "../../../core/entities/user";
import { ConflictError } from "../errors/conflict-error";
import { UserRepository } from "../../../adapters/repositories/user-repository";
import { HasherAndCompare } from "../../../infraestructure/cryptography/cryptography";
import { Either, failure, success } from "../../../utils/either";

type CreateUserUseCaseRequest = {
  name: string;
  email: string;
  password: string;
};

class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hasher: HasherAndCompare
  ) {}

  public async execute({
    name,
    email,
    password,
  }: CreateUserUseCaseRequest): Promise<Either<ConflictError, User>> {
    const emailAlreadyExists = await this.userRepository.findByEmail(email);

    if (emailAlreadyExists) {
      return failure(new ConflictError(`Esse email já está em uso`));
    }

    const passwordHashed = await this.hasher.hash(password);

    const userCreated = User.create(name, email, passwordHashed);

    const user = await this.userRepository.create(userCreated);

    return success(user);
  }
}

export { CreateUserUseCase };
