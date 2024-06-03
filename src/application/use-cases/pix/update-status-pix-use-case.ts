import { Pix } from "../../../core/entities/pix";
import { PixRepository } from "../../../adapters/repositories/pix-repository";
import { NotFoundError } from "../errors/not-found-error";
import { Either, failure, success } from "../../../utils/either";

type UpdateStatusPixUseCaseRequest = {
  id: string;
};

class UpdateStatusPixUseCase {
  constructor(private pixRepository: PixRepository) {}

  public async execute({ id }: UpdateStatusPixUseCaseRequest): Promise<Either<NotFoundError, Pix>> {
    const pixExists = await this.pixRepository.findById(id);

    if (!pixExists) {
      return failure(new NotFoundError(`Nenhum pix encontrado com o ID: ${id}`));
    }

    const status = pixExists.updateStatus();

    const pix = await this.pixRepository.updateStatus(id, status);

    return success(pix);
  }
}

export { UpdateStatusPixUseCase };
