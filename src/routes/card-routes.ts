import { HttpServer } from "../infraestructure/http/http-server";
import { CardRepository } from "../adapters/repositories/card-repository";
import { CardController } from "../adapters/controllers/card-controller";
import { UserRepository } from "../adapters/repositories/user-repository";
import { DatabaseConnection } from "../infraestructure/database/database-connection";
import { UserRepositoryDatabase } from "../infraestructure/repositories/user-repository-database";
import { CardRepositoryDatabase } from "../infraestructure/repositories/card-repository-database";
import {
  FindAllCardsUseCase,
  FindCardsByUserUseCase,
  FindCardByIdUseCase,
  FindCardByCardNumberUseCase,
  CreateCardUseCase,
  DeleteCardUseCase,
} from "../application/use-cases/card/index";

class CardRoutes {
  private readonly cardRepository: CardRepository;
  private readonly userRepository: UserRepository;

  constructor(
    private readonly connection: DatabaseConnection,
    private readonly httpServer: HttpServer
  ) {
    this.cardRepository = new CardRepositoryDatabase(this.connection);
    this.userRepository = new UserRepositoryDatabase(this.connection);
  }

  public routes() {
    const findAllCardsUseCase = new FindAllCardsUseCase(this.cardRepository);
    const findCardsByUserUseCase = new FindCardsByUserUseCase(this.cardRepository);
    const findCardByIdUseCase = new FindCardByIdUseCase(this.cardRepository);
    const findCardByCardNumberUseCase = new FindCardByCardNumberUseCase(this.cardRepository);
    const createCardUseCase = new CreateCardUseCase(this.cardRepository, this.userRepository);
    const deleteCardUseCase = new DeleteCardUseCase(this.cardRepository);

    return new CardController(
      this.httpServer,
      findAllCardsUseCase,
      findCardsByUserUseCase,
      findCardByIdUseCase,
      findCardByCardNumberUseCase,
      createCardUseCase,
      deleteCardUseCase
    );
  }
}

export { CardRoutes };
