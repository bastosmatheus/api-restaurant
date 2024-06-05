import { HttpServer } from "../infraestructure/http/http-server";
import { DatabaseConnection } from "../infraestructure/database/database-connection";
import { DeliveryRepository } from "../adapters/repositories/delivery-repository";
import { DeliverymanRepository } from "../adapters/repositories/deliveryman-repository";
import { OrderRepository } from "../adapters/repositories/order-repository";
import { DeliveryRepositoryDatabase } from "../infraestructure/repositories/delivery-repository-database";
import { OrderRepositoryDatabase } from "../infraestructure/repositories/order-repository-database";
import { DeliverymanRepositoryDatabase } from "../infraestructure/repositories/deliveryman-repository-database";
import {
  CreateDeliveryUseCase,
  DeliveryAcceptedUseCase,
  DeliveryCompletedUseCase,
  FindAllDeliveriesUseCase,
  FindDeliveriesByDeliverymanUseCase,
  FindDeliveryByIdUseCase,
} from "../application/use-cases/delivery/index";
import { DeliveryController } from "../adapters/controllers/delivery-controller";

class DeliveryRoutes {
  private readonly deliveryRepository: DeliveryRepository;
  private readonly orderRepository: OrderRepository;
  private readonly deliverymanRepository: DeliverymanRepository;

  constructor(
    private connection: DatabaseConnection,
    private httpServer: HttpServer
  ) {
    this.deliveryRepository = new DeliveryRepositoryDatabase(this.connection);
    this.orderRepository = new OrderRepositoryDatabase(this.connection);
    this.deliverymanRepository = new DeliverymanRepositoryDatabase(this.connection);
  }

  public routes() {
    const findAllDeliveriesUseCase = new FindAllDeliveriesUseCase(this.deliveryRepository);
    const findDeliveriesByDeliverymanUseCase = new FindDeliveriesByDeliverymanUseCase(
      this.deliveryRepository
    );
    const findDeliveryByIdUseCase = new FindDeliveryByIdUseCase(this.deliveryRepository);
    const createDeliveryUseCase = new CreateDeliveryUseCase(
      this.deliveryRepository,
      this.orderRepository
    );
    const deliveryAcceptedUseCase = new DeliveryAcceptedUseCase(
      this.deliveryRepository,
      this.deliverymanRepository,
      this.orderRepository
    );
    const deliveryCompletedUseCase = new DeliveryCompletedUseCase(
      this.deliveryRepository,
      this.orderRepository
    );

    return new DeliveryController(
      this.httpServer,
      findAllDeliveriesUseCase,
      findDeliveriesByDeliverymanUseCase,
      findDeliveryByIdUseCase,
      createDeliveryUseCase,
      deliveryAcceptedUseCase,
      deliveryCompletedUseCase
    );
  }
}

export { DeliveryRoutes };
