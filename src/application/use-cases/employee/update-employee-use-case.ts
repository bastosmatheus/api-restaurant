import { NotFoundError } from "../errors/not-found-error";
import { EmployeeRepository } from "../../../adapters/repositories/employee-repository";
import { Employee, EmployeeRole } from "../../../core/entities/employee";
import { Either, failure, success } from "../../../utils/either";
import { UnauthorizedError } from "../errors/unauthorized-error";

type UpdateEmployeeUseCaseRequest = {
  id: string;
  name: string;
  employee_role: EmployeeRole;
  id_employee: string;
};

class UpdateEmployeeUseCase {
  constructor(private employeeRepository: EmployeeRepository) {}

  public async execute({
    id,
    name,
    employee_role,
    id_employee,
  }: UpdateEmployeeUseCaseRequest): Promise<Either<NotFoundError | UnauthorizedError, Employee>> {
    const employeeExists = await this.employeeRepository.findById(id);

    if (!employeeExists) {
      return failure(new NotFoundError(`Nenhum funcionário encontrado com o ID ${id}`));
    }

    if (id !== id_employee) {
      return failure(
        new UnauthorizedError(`Você não tem permissão para atualizar esse funcionário`)
      );
    }

    employeeExists.setName(name);
    employeeExists.setEmployeeRole(employee_role);

    const employee = await this.employeeRepository.update(employeeExists);

    return success(employee);
  }
}

export { UpdateEmployeeUseCase };
