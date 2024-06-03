import { Pix } from "../../../core/entities/pix";
import { NotFoundError } from "../errors/not-found-error";
import { PixRepository } from "../../../adapters/repositories/pix-repository";
import { Either, failure, success } from "../../../utils/either";

type FindPixByIdUseCaseRequest = {
  id: string;
};

class FindPixByIdUseCase {
  constructor(private pixRepository: PixRepository) {}

  public async execute({ id }: FindPixByIdUseCaseRequest): Promise<Either<NotFoundError, Pix>> {
    const pix = await this.pixRepository.findById(id);

    if (!pix) {
      return failure(new NotFoundError(`Nenhum pix encontrado com o ID: ${id}`));
    }

    return success(pix);
  }
}

export { FindPixByIdUseCase };
