import { Pix } from "../../../core/entities/pix";
import { NotFoundError } from "../errors/not-found-error";
import { PixRepository } from "../../../adapters/repositories/pix-repository";
import { Either, failure, success } from "../../../utils/either";

type FindPixByCodeUseCaseRequest = {
  code: string;
};

class FindPixByCodeUseCase {
  constructor(private pixRepository: PixRepository) {}

  public async execute({ code }: FindPixByCodeUseCaseRequest): Promise<Either<NotFoundError, Pix>> {
    const pix = await this.pixRepository.findByCode(code);

    if (!pix) {
      return failure(new NotFoundError(`Nenhum pix encontrado com o código: ${code}`));
    }

    return success(pix);
  }
}

export { FindPixByCodeUseCase };
