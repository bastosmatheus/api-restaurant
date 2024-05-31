import { Card } from "../../../core/entities/card";
import { NotFoundError } from "../errors/not-found-error";
import { CardRepository } from "../../../adapters/repositories/card-repository";
import { Either, failure, success } from "../../../utils/either";

type FindCardByIdUseCaseRequest = {
  id: string;
};

class FindCardByIdUseCase {
  constructor(private cardRepository: CardRepository) {}

  public async execute({ id }: FindCardByIdUseCaseRequest): Promise<Either<NotFoundError, Card>> {
    const card = await this.cardRepository.findById(id);

    if (!card) {
      return failure(new NotFoundError(`Nenhum cartão encontrado com o ID: ${id}`));
    }

    return success(card);
  }
}

export { FindCardByIdUseCase };
