import { HttpServer } from "../infraestructure/http/http-server";
import { PixRepository } from "../adapters/repositories/pix-repository";
import { UserRepository } from "../adapters/repositories/user-repository";
import { CardRepository } from "../adapters/repositories/card-repository";
import { OrderRepository } from "../adapters/repositories/order-repository";
import { OrderController } from "../adapters/controllers/order-controller";
import { DatabaseConnection } from "../infraestructure/database/database-connection";
import { PixRepositoryDatabase } from "../infraestructure/repositories/pix-repository-database";
import { UserRepositoryDatabase } from "../infraestructure/repositories/user-repository-database";
import { CardRepositoryDatabase } from "../infraestructure/repositories/card-repository-database";
import { OrderRepositoryDatabase } from "../infraestructure/repositories/order-repository-database";
import {
  CreateOrderUseCase,
  FindAllOrdersUseCase,
  FindOrderByIdUseCase,
  FindOrdersByCardUseCase,
  FindOrdersByCardsUseCase,
  FindOrdersByPixsUseCase,
  FindOrdersByStatusUseCase,
  FindOrdersByUserUseCase,
  UpdateStatusOrderUseCase,
} from "../application/use-cases/order";

class OrderRoutes {
  private readonly orderRepository: OrderRepository;
  private readonly userRepository: UserRepository;
  private readonly pixRepository: PixRepository;
  private readonly cardRepository: CardRepository;

  constructor(
    private readonly connection: DatabaseConnection,
    private readonly httpServer: HttpServer
  ) {
    this.orderRepository = new OrderRepositoryDatabase(this.connection);
    this.userRepository = new UserRepositoryDatabase(this.connection);
    this.pixRepository = new PixRepositoryDatabase(this.connection);
    this.cardRepository = new CardRepositoryDatabase(this.connection);
  }

  public routes() {
    const findAllOrdersUseCase = new FindAllOrdersUseCase(this.orderRepository);
    const findOrdersByCardsUseCase = new FindOrdersByCardsUseCase(this.orderRepository);
    const findOrdersByPixsUseCase = new FindOrdersByPixsUseCase(this.orderRepository);
    const findOrdersByCardUseCase = new FindOrdersByCardUseCase(this.orderRepository);
    const findOrdersByUserUseCase = new FindOrdersByUserUseCase(this.orderRepository);
    const findOrdersByStatusUseCase = new FindOrdersByStatusUseCase(this.orderRepository);
    const findOrderByIdUseCase = new FindOrderByIdUseCase(this.orderRepository);
    const createOrderUseCase = new CreateOrderUseCase(
      this.orderRepository,
      this.userRepository,
      this.pixRepository,
      this.cardRepository
    );
    const updateStatusOrderUseCase = new UpdateStatusOrderUseCase(this.orderRepository);

    return new OrderController(
      this.httpServer,
      findAllOrdersUseCase,
      findOrdersByCardsUseCase,
      findOrdersByPixsUseCase,
      findOrdersByCardUseCase,
      findOrdersByUserUseCase,
      findOrdersByStatusUseCase,
      findOrderByIdUseCase,
      createOrderUseCase,
      updateStatusOrderUseCase
    );
  }
}

export { OrderRoutes };
