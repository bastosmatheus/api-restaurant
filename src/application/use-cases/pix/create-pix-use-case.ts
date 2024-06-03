import { Pix } from "../../../core/entities/pix";
import { NotFoundError } from "../errors/not-found-error";
import { PixRepository } from "../../../adapters/repositories/pix-repository";
import { UserRepository } from "../../../adapters/repositories/user-repository";
import { Either, failure, success } from "../../../utils/either";

type CreatePixUseCaseRequest = {
  id_user: string;
};

class CreatePixUseCase {
  constructor(
    private pixRepository: PixRepository,
    private userRepository: UserRepository
  ) {}

  public async execute({ id_user }: CreatePixUseCaseRequest): Promise<Either<NotFoundError, Pix>> {
    const userExists = await this.userRepository.findById(id_user);

    if (!userExists) {
      return failure(new NotFoundError(`Nenhum usuário encontrado com o ID: ${id_user}`));
    }

    const pixCreated = Pix.create(id_user);

    const pix = await this.pixRepository.create(pixCreated);

    return success(pix);
  }
}

export { CreatePixUseCase };
