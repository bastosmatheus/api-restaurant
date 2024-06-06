import { HttpServer } from "../infraestructure/http/http-server";
import { FoodRepository } from "../adapters/repositories/food-repository";
import { OrderRepository } from "../adapters/repositories/order-repository";
import { DatabaseConnection } from "../infraestructure/database/database-connection";
import { OrderFoodRepository } from "../adapters/repositories/order-food-repository";
import { OrderFoodController } from "../adapters/controllers/order-food-controller";
import { FoodRepositoryDatabase } from "../infraestructure/repositories/food-repository-database";
import { OrderRepositoryDatabase } from "../infraestructure/repositories/order-repository-database";
import { OrderFoodRepositoryDatabase } from "../infraestructure/repositories/order-food-repository-database";
import {
  CreateOrderFoodUseCase,
  FindAllOrdersFoodsUseCase,
  FindOrdersFoodsByFoodUseCase,
  FindOrderFoodByIdUseCase,
  FindOrdersFoodsByOrderUseCase,
} from "../application/use-cases/order-food";

class OrderFoodRoutes {
  private readonly orderFoodRepository: OrderFoodRepository;
  private readonly orderRepository: OrderRepository;
  private readonly foodRepository: FoodRepository;

  constructor(
    private readonly connection: DatabaseConnection,
    private readonly httpServer: HttpServer
  ) {
    this.orderFoodRepository = new OrderFoodRepositoryDatabase(this.connection);
    this.orderRepository = new OrderRepositoryDatabase(this.connection);
    this.foodRepository = new FoodRepositoryDatabase(this.connection);
  }

  public routes() {
    const findAllOrderFoodUseCase = new FindAllOrdersFoodsUseCase(this.orderFoodRepository);
    const findOrderFoodByFoodUseCase = new FindOrdersFoodsByFoodUseCase(this.orderFoodRepository);
    const findOrderFoodByOrderUseCase = new FindOrdersFoodsByOrderUseCase(this.orderFoodRepository);
    const findOrderFoodByIdUseCase = new FindOrderFoodByIdUseCase(this.orderFoodRepository);
    const createOrderFoodUseCase = new CreateOrderFoodUseCase(
      this.orderFoodRepository,
      this.orderRepository,
      this.foodRepository
    );

    return new OrderFoodController(
      this.httpServer,
      findAllOrderFoodUseCase,
      findOrderFoodByFoodUseCase,
      findOrderFoodByOrderUseCase,
      findOrderFoodByIdUseCase,
      createOrderFoodUseCase
    );
  }
}

export { OrderFoodRoutes };
