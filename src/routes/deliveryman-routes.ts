import { HttpServer } from "../infraestructure/http/http-server";
import { HasherAndCompare } from "../infraestructure/cryptography/cryptography";
import { DatabaseConnection } from "../infraestructure/database/database-connection";
import { DeliverymanController } from "../adapters/controllers/deliveryman-controller";
import { DeliverymanRepositoryDatabase } from "../infraestructure/repositories/deliveryman-repository-database";
import {
  FindAllDeliverymansUseCase,
  FindDeliverymanByIdUseCase,
  FindDeliverymanByEmailUseCase,
  CreateDeliverymanUseCase,
  UpdateDeliverymanUseCase,
  UpdatePasswordDeliverymanUseCase,
  DeleteDeliverymanUseCase,
  LoginDeliverymanUseCase,
} from "../application/use-cases/deliveryman/index";
import { Token } from "../infraestructure/token/token";

class DeliverymanRoutes {
  private readonly deliverymanRepository: DeliverymanRepositoryDatabase;

  constructor(
    private readonly connection: DatabaseConnection,
    private readonly httpServer: HttpServer,
    private readonly cryptography: HasherAndCompare,
    private readonly token: Token
  ) {
    this.deliverymanRepository = new DeliverymanRepositoryDatabase(this.connection);
  }

  public routes() {
    const findAllDeliverymansUseCase = new FindAllDeliverymansUseCase(this.deliverymanRepository);
    const findDeliverymanByIdUseCase = new FindDeliverymanByIdUseCase(this.deliverymanRepository);
    const findDeliverymanByEmailUseCase = new FindDeliverymanByEmailUseCase(
      this.deliverymanRepository
    );
    const createDeliverymanUseCase = new CreateDeliverymanUseCase(
      this.deliverymanRepository,
      this.cryptography
    );
    const updateDeliverymanUseCase = new UpdateDeliverymanUseCase(this.deliverymanRepository);
    const updatePasswordDeliverymanUseCase = new UpdatePasswordDeliverymanUseCase(
      this.deliverymanRepository,
      this.cryptography
    );
    const deleteDeliverymanUseCase = new DeleteDeliverymanUseCase(this.deliverymanRepository);
    const loginDeliverymanUseCase = new LoginDeliverymanUseCase(
      this.deliverymanRepository,
      this.cryptography,
      this.token
    );

    return new DeliverymanController(
      this.httpServer,
      findAllDeliverymansUseCase,
      findDeliverymanByIdUseCase,
      findDeliverymanByEmailUseCase,
      createDeliverymanUseCase,
      updateDeliverymanUseCase,
      updatePasswordDeliverymanUseCase,
      deleteDeliverymanUseCase,
      loginDeliverymanUseCase
    );
  }
}

export { DeliverymanRoutes };
