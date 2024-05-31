import { User } from "../../../core/entities/user";
import { NotFoundError } from "../errors/not-found-error";
import { UserRepository } from "../../../adapters/repositories/user-repository";
import { Either, failure, success } from "../../../utils/either";

type FindUserByEmailUseCaseRequest = {
  email: string;
};

class FindUserByEmailUseCase {
  constructor(private userRepository: UserRepository) {}

  public async execute({
    email,
  }: FindUserByEmailUseCaseRequest): Promise<Either<NotFoundError, User>> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return failure(new NotFoundError(`Nenhum usuário encontrado com o email: ${email}`));
    }

    return success(user);
  }
}

export { FindUserByEmailUseCase };
