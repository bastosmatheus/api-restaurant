import { HttpServer } from "../infraestructure/http/http-server";
import { PixRepository } from "../adapters/repositories/pix-repository";
import { PixController } from "../adapters/controllers/pix-controller";
import { UserRepository } from "../adapters/repositories/user-repository";
import { DatabaseConnection } from "../infraestructure/database/database-connection";
import { PixRepositoryDatabase } from "../infraestructure/repositories/pix-repository-database";
import { UserRepositoryDatabase } from "../infraestructure/repositories/user-repository-database";
import {
  CreatePixUseCase,
  FindAllPixsUseCase,
  FindPixByCodeUseCase,
  FindPixByIdUseCase,
  FindPixsByStatusUseCase,
  FindPixsByUserUseCase,
  UpdateStatusPixUseCase,
} from "../application/use-cases/pix";

class PixRoutes {
  private readonly pixRepository: PixRepository;
  private readonly userRepository: UserRepository;

  constructor(
    private readonly connection: DatabaseConnection,
    private readonly httpServer: HttpServer
  ) {
    this.pixRepository = new PixRepositoryDatabase(this.connection);
    this.userRepository = new UserRepositoryDatabase(this.connection);
  }

  public routes() {
    const findAllPixsUseCase = new FindAllPixsUseCase(this.pixRepository);
    const findPixsByUserUseCase = new FindPixsByUserUseCase(this.pixRepository);
    const findPixsByStatusUseCase = new FindPixsByStatusUseCase(this.pixRepository);
    const findPixByIdUseCase = new FindPixByIdUseCase(this.pixRepository);
    const findPixByCodeUseCase = new FindPixByCodeUseCase(this.pixRepository);
    const createPixUseCase = new CreatePixUseCase(this.pixRepository, this.userRepository);
    const updateStatusPixUseCase = new UpdateStatusPixUseCase(this.pixRepository);

    return new PixController(
      this.httpServer,
      findAllPixsUseCase,
      findPixsByUserUseCase,
      findPixsByStatusUseCase,
      findPixByIdUseCase,
      findPixByCodeUseCase,
      createPixUseCase,
      updateStatusPixUseCase
    );
  }
}

export { PixRoutes };
