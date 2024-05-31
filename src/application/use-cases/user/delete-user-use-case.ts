import { User } from "../../../core/entities/user";
import { NotFoundError } from "../errors/not-found-error";
import { UserRepository } from "../../../adapters/repositories/user-repository";
import { Either, failure, success } from "../../../utils/either";

type DeleteUserUseCaseRequest = {
  id: string;
};

class DeleteUserUseCase {
  constructor(private userRepository: UserRepository) {}

  public async execute({ id }: DeleteUserUseCaseRequest): Promise<Either<NotFoundError, User>> {
    const userExists = await this.userRepository.findById(id);

    if (!userExists) {
      return failure(new NotFoundError(`Nenhum usuário encontrado com o ID: ${id}`));
    }

    const user = await this.userRepository.delete(id);

    return success(user);
  }
}

export { DeleteUserUseCase };
