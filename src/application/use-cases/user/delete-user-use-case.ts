import { User } from "../../../core/entities/user";
import { NotFoundError } from "../errors/not-found-error";
import { UserRepository } from "../../../adapters/repositories/user-repository";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { Either, failure, success } from "../../../utils/either";

type DeleteUserUseCaseRequest = {
  id: string;
  id_user: string;
};

class DeleteUserUseCase {
  constructor(private userRepository: UserRepository) {}

  public async execute({
    id,
    id_user,
  }: DeleteUserUseCaseRequest): Promise<Either<NotFoundError | UnauthorizedError, User>> {
    const userExists = await this.userRepository.findById(id);

    if (!userExists) {
      return failure(new NotFoundError(`Nenhum usuário encontrado com o ID: ${id}`));
    }

    if (id !== id_user) {
      return failure(new UnauthorizedError(`Você não tem permissão para excluir esse usuário`));
    }

    const user = await this.userRepository.delete(id);

    return success(user);
  }
}

export { DeleteUserUseCase };
