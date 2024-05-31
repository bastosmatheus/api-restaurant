import { CardRepository } from "../../../adapters/repositories/card-repository";

type FindCardsByUserUseCaseRequest = {
  id_user: string;
};

class FindCardsByUserUseCase {
  constructor(private cardRepository: CardRepository) {}

  public async execute({ id_user }: FindCardsByUserUseCaseRequest) {
    const cards = await this.cardRepository.findByUser(id_user);

    return cards;
  }
}

export { FindCardsByUserUseCase };
