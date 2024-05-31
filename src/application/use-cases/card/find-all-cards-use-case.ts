import { CardRepository } from "../../../adapters/repositories/card-repository";

class FindAllCardsUseCase {
  constructor(private cardRepository: CardRepository) {}

  public async execute() {
    const cards = await this.cardRepository.findAll();

    return cards;
  }
}

export { FindAllCardsUseCase };
