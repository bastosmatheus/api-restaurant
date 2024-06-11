import { User } from "../../../core/entities/user";
import { NotFoundError } from "../errors/not-found-error";
import { UserRepository } from "../../../adapters/repositories/user-repository";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { Either, failure, success } from "../../../utils/either";

type UpdateUserUseCaseRequest = {
  id: string;
  name: string;
  id_user: string;
};

class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  public async execute({
    id,
    name,
    id_user,
  }: UpdateUserUseCaseRequest): Promise<Either<NotFoundError | UnauthorizedError, User>> {
    const userExists = await this.userRepository.findById(id);

    if (!userExists) {
      return failure(new NotFoundError(`Nenhum usuário encontrado com o ID: ${id}`));
    }

    if (id !== id_user) {
      return failure(new UnauthorizedError(`Você não tem permissão para atualizar esse usuário`));
    }

    userExists.setName(name);

    const user = await this.userRepository.update(userExists);

    return success(user);
  }
}

export { UpdateUserUseCase };
