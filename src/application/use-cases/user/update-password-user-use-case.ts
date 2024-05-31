import { User } from "../../../core/entities/user";
import { NotFoundError } from "../errors/not-found-error";
import { UserRepository } from "../../../adapters/repositories/user-repository";
import { Either, failure, success } from "../../../utils/either";
import { Hasher } from "../../../infraestructure/cryptography/cryptography";

type UpdatePasswordUserUseCaseRequest = {
  id: string;
  password: string;
};

class UpdatePasswordUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hasher: Hasher
  ) {}

  public async execute({
    id,
    password,
  }: UpdatePasswordUserUseCaseRequest): Promise<Either<NotFoundError, User>> {
    const userExists = await this.userRepository.findById(id);

    if (!userExists) {
      return failure(new NotFoundError(`Nenhum usuário encontrado com o ID: ${id}`));
    }

    const passwordHashed = await this.hasher.hash(password);

    userExists.setPassword(passwordHashed);

    const user = await this.userRepository.updatePasword(userExists.id, userExists.password);

    return success(user);
  }
}

export { UpdatePasswordUserUseCase };
