import { User } from "../../../core/entities/user";
import { NotFoundError } from "../errors/not-found-error";
import { UserRepository } from "../../../adapters/repositories/user-repository";
import { Either, failure, success } from "../../../utils/either";

type FindUserByIdUseCaseRequest = {
  id: string;
};

class FindUserByIdUseCase {
  constructor(private userRepository: UserRepository) {}

  public async execute({ id }: FindUserByIdUseCaseRequest): Promise<Either<NotFoundError, User>> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      return failure(new NotFoundError(`Nenhum usuário encontrado com o ID: ${id}`));
    }

    return success(user);
  }
}

export { FindUserByIdUseCase };
