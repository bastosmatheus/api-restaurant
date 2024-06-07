import { HttpServer } from "../infraestructure/http/http-server";
import { UserRepository } from "../adapters/repositories/user-repository";
import { UserController } from "../adapters/controllers/user-controller";
import { HasherAndCompare } from "../infraestructure/cryptography/cryptography";
import { DatabaseConnection } from "../infraestructure/database/database-connection";
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
import { LoginUserUseCase } from "../application/use-cases/user/login-user-use-case";
import { Token } from "../infraestructure/token/token";

class UserRoutes {
  private readonly userRepository: UserRepository;

  constructor(
    private readonly connection: DatabaseConnection,
    private readonly httpServer: HttpServer,
    private readonly cryptography: HasherAndCompare,
    private readonly token: Token
  ) {
    this.userRepository = new UserRepositoryDatabase(this.connection);
  }

  public routes() {
    const findAllUsersUseCase = new FindAllUsersUseCase(this.userRepository);
    const findUserByIdUseCase = new FindUserByIdUseCase(this.userRepository);
    const findUserByEmailUseCase = new FindUserByEmailUseCase(this.userRepository);
    const createUserUseCase = new CreateUserUseCase(this.userRepository, this.cryptography);
    const updateUserUseCase = new UpdateUserUseCase(this.userRepository);
    const updatePasswordUserUseCase = new UpdatePasswordUserUseCase(
      this.userRepository,
      this.cryptography
    );
    const deleteUserUseCase = new DeleteUserUseCase(this.userRepository);
    const loginUserUseCase = new LoginUserUseCase(
      this.userRepository,
      this.cryptography,
      this.token
    );

    return new UserController(
      this.httpServer,
      findAllUsersUseCase,
      findUserByIdUseCase,
      findUserByEmailUseCase,
      createUserUseCase,
      updateUserUseCase,
      updatePasswordUserUseCase,
      deleteUserUseCase,
      loginUserUseCase
    );
  }
}

export { UserRoutes };
