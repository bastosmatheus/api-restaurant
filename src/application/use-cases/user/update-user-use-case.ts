import { User } from "../../../core/entities/user";
import { NotFoundError } from "../errors/not-found-error";
import { UserRepository } from "../../../adapters/repositories/user-repository";
import { Either, failure, success } from "../../../utils/either";

type UpdateUserUseCaseRequest = {
  id: string;
  name: string;
};

class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  public async execute({
    id,
    name,
  }: UpdateUserUseCaseRequest): Promise<Either<NotFoundError, User>> {
    const userExists = await this.userRepository.findById(id);

    if (!userExists) {
      return failure(new NotFoundError(`Nenhum usuário encontrado com o ID: ${id}`));
    }

    userExists.setName(name);

    const user = await this.userRepository.update(userExists);

    return success(user);
  }
}

export { UpdateUserUseCase };
