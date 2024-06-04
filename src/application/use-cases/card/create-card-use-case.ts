import { Card } from "../../../core/entities/card";
import { ConflictError } from "../errors/conflict-error";
import { NotFoundError } from "../errors/not-found-error";
import { CardRepository } from "../../../adapters/repositories/card-repository";
import { UserRepository } from "../../../adapters/repositories/user-repository";
import { Either, failure, success } from "../../../utils/either";

type CreateCardUseCaseRequest = {
  card_holder_name: string;
  card_number: string;
  expiration_date: Date;
  id_user: string;
};

class CreateCardUseCase {
  constructor(
    private cardRepository: CardRepository,
    private userRepository: UserRepository
  ) {}

  public async execute({
    card_holder_name,
    card_number,
    expiration_date,
    id_user,
  }: CreateCardUseCaseRequest): Promise<Either<NotFoundError | ConflictError, Card>> {
    const userExists = await this.userRepository.findById(id_user);

    if (!userExists) {
      return failure(new NotFoundError(`Nenhum usuário encontrado com o ID: ${id_user}`));
    }

    const cardNumberAlreadyExists = await this.cardRepository.findByCardNumber(card_number);

    if (cardNumberAlreadyExists) {
      return failure(new ConflictError(`Esse cartão ja está cadastrado`));
    }

    const cardCreated = Card.create(card_holder_name, card_number, expiration_date, id_user);

    const card = await this.cardRepository.create(cardCreated);

    return success(card);
  }
}

export { CreateCardUseCase };
