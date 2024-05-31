import { PgpAdapter } from "../infraestructure/database/database-connection";
import { HttpServer } from "../infraestructure/http/http-server";
import { BcryptAdapter } from "../infraestructure/cryptography/cryptography";
import { EmployeeController } from "../adapters/controllers/employee-controller";
import { EmployeeRepositoryDatabase } from "../infraestructure/repositories/employee-repository-database";
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
    private readonly connection: PgpAdapter,
    private readonly httpServer: HttpServer,
    private readonly bcryptAdapter: BcryptAdapter
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
      this.bcryptAdapter
    );
    const updatePasswordEmployeeUseCase = new UpdatePasswordEmployeeUseCase(
      this.employeeRepository,
      this.bcryptAdapter
    );
    const updateEmployeeUseCase = new UpdateEmployeeUseCase(this.employeeRepository);
    const deleteEmployeeUseCase = new DeleteEmployeeUseCase(this.employeeRepository);

    return new EmployeeController(
      this.httpServer,
      findAllEmployeesUseCase,
      findEmployeesByRoleUseCase,
      findEmployeeByIdUseCase,
      findEmployeeByEmailUseCase,
      createEmployeeUseCase,
      updateEmployeeUseCase,
      updatePasswordEmployeeUseCase,
      deleteEmployeeUseCase
    );
  }
}

export { EmployeeRoutes };
