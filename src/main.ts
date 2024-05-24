import { PgpAdapter } from "./infraestructure/database/database-connection";
import { BcryptAdapter } from "./infraestructure/cryptography/cryptography";
import { FoodControler } from "./adapters/controllers/food-controller";
import { ExpressAdapter } from "./infraestructure/http/http-server";
import { CreateFoodUseCase } from "./application/use-cases/food/create-food-use-case";
import { UpdateFoodUseCase } from "./application/use-cases/food/update-food-use-case";
import { DeleteFoodUseCase } from "./application/use-cases/food/delete-food-use-case";
import { EmployeeController } from "./adapters/controllers/employee-controller";
import { FindAllFoodsUseCase } from "./application/use-cases/food/find-all-foods-use-case";
import { FindFoodByIdUseCase } from "./application/use-cases/food/find-food-by-id-use-case";
import { FindFoodByNameUseCase } from "./application/use-cases/food/find-food-by-name-use-case";
import { CreateEmployeeUseCase } from "./application/use-cases/employee/create-employee-use-case";
import { UpdateEmployeeUseCase } from "./application/use-cases/employee/update-employee-use-case";
import { UpdatePasswordUseCase } from "./application/use-cases/employee/update-password-use-case";
import { DeleteEmployeeUseCase } from "./application/use-cases/employee/delete-employee-use-case";
import { FoodRepositoryDatabase } from "./infraestructure/repositories/food-repository-database";
import { FindAllEmployeesUseCase } from "./application/use-cases/employee/find-all-employees-use-case";
import { FindEmployeeByIdUseCase } from "./application/use-cases/employee/find-employee-by-id-use-case";
import { FindFoodsByCategoryUseCase } from "./application/use-cases/food/find-foods-by-category-use-case";
import { EmployeeRepositoryDatabase } from "./infraestructure/repositories/employee-repository-database";
import { FindEmployeesByRoleUseCase } from "./application/use-cases/employee/find-employees-by-role-use-case";
import { FindEmployeeByEmailUseCase } from "./application/use-cases/employee/find-employee-by-email-use-case";

// adapters/banco de dados
const httpServer = new ExpressAdapter();
const connection = new PgpAdapter();
const cryptography = new BcryptAdapter();
const foodRepository = new FoodRepositoryDatabase(connection);
const employeeRepository = new EmployeeRepositoryDatabase(connection);
httpServer.listen(3000);

// use cases (FOOD)
const findAllFoodsUseCase = new FindAllFoodsUseCase(foodRepository);
const findFoodsByCategoryUseCase = new FindFoodsByCategoryUseCase(foodRepository);
const findFoodByNameUseCase = new FindFoodByNameUseCase(foodRepository);
const findFoodByIdUseCase = new FindFoodByIdUseCase(foodRepository);
const createFoodUseCase = new CreateFoodUseCase(foodRepository);
const updateFoodUseCase = new UpdateFoodUseCase(foodRepository);
const deleteFoodUseCase = new DeleteFoodUseCase(foodRepository);
new FoodControler(
  httpServer,
  findAllFoodsUseCase,
  findFoodsByCategoryUseCase,
  findFoodByIdUseCase,
  findFoodByNameUseCase,
  createFoodUseCase,
  updateFoodUseCase,
  deleteFoodUseCase
);

// use cases (EMPLOYEE)
const findAllEmployeesUseCase = new FindAllEmployeesUseCase(employeeRepository);
const findEmployeesByRoleUseCase = new FindEmployeesByRoleUseCase(employeeRepository);
const findEmployeeByIdUseCase = new FindEmployeeByIdUseCase(employeeRepository);
const findEmployeeByEmailUseCase = new FindEmployeeByEmailUseCase(employeeRepository);
const createEmployeeUseCase = new CreateEmployeeUseCase(employeeRepository, cryptography);
const updateEmployeeUseCase = new UpdateEmployeeUseCase(employeeRepository);
const updatePasswordUseCase = new UpdatePasswordUseCase(employeeRepository, cryptography);
const deleteEmployeeUseCase = new DeleteEmployeeUseCase(employeeRepository);
new EmployeeController(
  httpServer,
  findAllEmployeesUseCase,
  findEmployeesByRoleUseCase,
  findEmployeeByIdUseCase,
  findEmployeeByEmailUseCase,
  createEmployeeUseCase,
  updateEmployeeUseCase,
  updatePasswordUseCase,
  deleteEmployeeUseCase
);
