import { Token } from "../infraestructure/token/token";
import { HttpServer } from "../infraestructure/http/http-server";
import { HasherAndCompare } from "../infraestructure/cryptography/cryptography";
import { DatabaseConnection } from "../infraestructure/database/database-connection";
import { EmployeeController } from "../adapters/controllers/employee-controller";
import { EmployeeRepositoryDatabase } from "../infraestructure/repositories/employee-repository-database";
import { LoginEmployeeUseCase } from "../application/use-cases/employee/login-employee-use-case";
import {
  FindAllEmployeesUseCase,
  FindEmployeesByRoleUseCase,
  FindEmployeeByIdUseCase,
  FindEmployeeByEmailUseCase,
  CreateEmployeeUseCase,
  UpdateEmployeeUseCase,
  DeleteEmployeeUseCase,
  UpdatePasswordEmployeeUseCase,
} from "../application/use-cases/employee/index";

class EmployeeRoutes {
  private readonly employeeRepository: EmployeeRepositoryDatabase;

  constructor(
    private readonly connection: DatabaseConnection,
    private readonly httpServer: HttpServer,
    private readonly cryptography: HasherAndCompare,
    private readonly token: Token
  ) {
    this.employeeRepository = new EmployeeRepositoryDatabase(this.connection);
  }

  public routes() {
    const findAllEmployeesUseCase = new FindAllEmployeesUseCase(this.employeeRepository);
    const findEmployeesByRoleUseCase = new FindEmployeesByRoleUseCase(this.employeeRepository);
    const findEmployeeByEmailUseCase = new FindEmployeeByEmailUseCase(this.employeeRepository);
    const findEmployeeByIdUseCase = new FindEmployeeByIdUseCase(this.employeeRepository);
    const createEmployeeUseCase = new CreateEmployeeUseCase(
      this.employeeRepository,
      this.cryptography
    );
    const updatePasswordEmployeeUseCase = new UpdatePasswordEmployeeUseCase(
      this.employeeRepository,
      this.cryptography
    );
    const updateEmployeeUseCase = new UpdateEmployeeUseCase(this.employeeRepository);
    const deleteEmployeeUseCase = new DeleteEmployeeUseCase(this.employeeRepository);
    const loginEmployeeUseCase = new LoginEmployeeUseCase(
      this.employeeRepository,
      this.cryptography,
      this.token
    );

    return new EmployeeController(
      this.httpServer,
      findAllEmployeesUseCase,
      findEmployeesByRoleUseCase,
      findEmployeeByIdUseCase,
      findEmployeeByEmailUseCase,
      createEmployeeUseCase,
      updateEmployeeUseCase,
      updatePasswordEmployeeUseCase,
      deleteEmployeeUseCase,
      loginEmployeeUseCase
    );
  }
}

export { EmployeeRoutes };
