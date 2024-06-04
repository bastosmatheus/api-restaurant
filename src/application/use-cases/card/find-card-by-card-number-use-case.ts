import { Card } from "../../../core/entities/card";
import { NotFoundError } from "../errors/not-found-error";
import { CardRepository } from "../../../adapters/repositories/card-repository";
import { Either, failure, success } from "../../../utils/either";

type FindCardByCardNumberUseCaseRequest = {
  card_number: string;
};

class FindCardByCardNumberUseCase {
  constructor(private cardRepository: CardRepository) {}

  public async execute({
    card_number,
  }: FindCardByCardNumberUseCaseRequest): Promise<Either<NotFoundError, Card>> {
    const card = await this.cardRepository.findByCardNumber(card_number);

    if (!card) {
      return failure(new NotFoundError(`Nenhum cartão encontrado com o número: ${card_number}`));
    }

    return success(card);
  }
}

export { FindCardByCardNumberUseCase };
