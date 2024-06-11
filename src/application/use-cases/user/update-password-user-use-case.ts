import { User } from "../../../core/entities/user";
import { NotFoundError } from "../errors/not-found-error";
import { UserRepository } from "../../../adapters/repositories/user-repository";
import { HasherAndCompare } from "../../../infraestructure/cryptography/cryptography";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { Either, failure, success } from "../../../utils/either";

type UpdatePasswordUserUseCaseRequest = {
  id: string;
  password: string;
  id_user: string;
};

class UpdatePasswordUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hasher: HasherAndCompare
  ) {}

  public async execute({
    id,
    password,
    id_user,
  }: UpdatePasswordUserUseCaseRequest): Promise<Either<NotFoundError | UnauthorizedError, User>> {
    const userExists = await this.userRepository.findById(id);

    if (!userExists) {
      return failure(new NotFoundError(`Nenhum usuário encontrado com o ID: ${id}`));
    }

    if (id !== id_user) {
      return failure(new UnauthorizedError(`Você não tem permissão para atualizar esse usuário`));
    }

    const passwordHashed = await this.hasher.hash(password);

    userExists.setPassword(passwordHashed);

    const user = await this.userRepository.updatePasword(userExists.id, userExists.password);

    return success(user);
  }
}

export { UpdatePasswordUserUseCase };
