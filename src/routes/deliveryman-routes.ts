import { Hasher } from "../infraestructure/cryptography/cryptography";
import { HttpServer } from "../infraestructure/http/http-server";
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
} from "../application/use-cases/deliveryman/index";

class DeliverymanRoutes {
  private readonly employeeRepository: DeliverymanRepositoryDatabase;

  constructor(
    private readonly connection: DatabaseConnection,
    private readonly httpServer: HttpServer,
    private readonly cryptography: Hasher
  ) {
    this.employeeRepository = new DeliverymanRepositoryDatabase(this.connection);
  }

  public routes() {
    const findAllDeliverymansUseCase = new FindAllDeliverymansUseCase(this.employeeRepository);
    const findDeliverymanByIdUseCase = new FindDeliverymanByIdUseCase(this.employeeRepository);
    const findDeliverymanByEmailUseCase = new FindDeliverymanByEmailUseCase(
      this.employeeRepository
    );
    const createDeliverymanUseCase = new CreateDeliverymanUseCase(
      this.employeeRepository,
      this.cryptography
    );
    const updateDeliverymanUseCase = new UpdateDeliverymanUseCase(this.employeeRepository);
    const updatePasswordDeliverymanUseCase = new UpdatePasswordDeliverymanUseCase(
      this.employeeRepository,
      this.cryptography
    );
    const deleteDeliverymanUseCase = new DeleteDeliverymanUseCase(this.employeeRepository);

    return new DeliverymanController(
      this.httpServer,
      findAllDeliverymansUseCase,
      findDeliverymanByIdUseCase,
      findDeliverymanByEmailUseCase,
      createDeliverymanUseCase,
      updateDeliverymanUseCase,
      updatePasswordDeliverymanUseCase,
      deleteDeliverymanUseCase
    );
  }
}

export { DeliverymanRoutes };
