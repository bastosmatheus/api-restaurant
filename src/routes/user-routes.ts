import { PgpAdapter } from "../infraestructure/database/database-connection";
import { HttpServer } from "../infraestructure/http/http-server";
import { BcryptAdapter } from "../infraestructure/cryptography/cryptography";
import { UserRepository } from "../adapters/repositories/user-repository";
import { UserRepositoryDatabase } from "../infraestructure/repositories/user-repository-database";
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  FindAllUsersUseCase,
  FindUserByEmailUseCase,
  FindUserByIdUseCase,
  UpdatePasswordUserUseCase,
  UpdateUserUseCase,
} from "../application/use-cases/user/index";
import { UserController } from "../adapters/controllers/user-controller";

class UserRoutes {
  private readonly userRepository: UserRepository;

  constructor(
    private readonly connection: PgpAdapter,
    private readonly httpServer: HttpServer,
    private readonly bcryptAdapter: BcryptAdapter
  ) {
    this.userRepository = new UserRepositoryDatabase(this.connection);
  }

  public routes() {
    const findAllUsersUseCase = new FindAllUsersUseCase(this.userRepository);
    const findUserByIdUseCase = new FindUserByIdUseCase(this.userRepository);
    const findUserByEmailUseCase = new FindUserByEmailUseCase(this.userRepository);
    const createUserUseCase = new CreateUserUseCase(this.userRepository, this.bcryptAdapter);
    const updateUserUseCase = new UpdateUserUseCase(this.userRepository);
    const updatePasswordUserUseCase = new UpdatePasswordUserUseCase(
      this.userRepository,
      this.bcryptAdapter
    );
    const deleteUserUseCase = new DeleteUserUseCase(this.userRepository);

    return new UserController(
      this.httpServer,
      findAllUsersUseCase,
      findUserByIdUseCase,
      findUserByEmailUseCase,
      createUserUseCase,
      updateUserUseCase,
      updatePasswordUserUseCase,
      deleteUserUseCase
    );
  }
}

export { UserRoutes };
