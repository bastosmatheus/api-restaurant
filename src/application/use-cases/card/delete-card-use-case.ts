import { Card } from "../../../core/entities/card";
import { NotFoundError } from "../errors/not-found-error";
import { CardRepository } from "../../../adapters/repositories/card-repository";
import { Either, failure, success } from "../../../utils/either";

type DeleteCardUseCaseRequest = {
  id: string;
};

class DeleteCardUseCase {
  constructor(private cardRepository: CardRepository) {}

  public async execute({ id }: DeleteCardUseCaseRequest): Promise<Either<NotFoundError, Card>> {
    const cardExists = await this.cardRepository.findById(id);

    if (!cardExists) {
      return failure(new NotFoundError(`Nenhum cartão encontrado com o ID: ${id}`));
    }

    const card = await this.cardRepository.delete(id);

    return success(card);
  }
}

export { DeleteCardUseCase };
