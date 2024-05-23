import { NotFoundError } from "../errors/not-found-error";
import { EmployeeRepository } from "../../../adapters/repositories/employee-repository";
import { Employee, EmployeeRole } from "../../../core/entities/employee";
import { Either, failure, success } from "../../../utils/either";

type UpdateEmployeeUseCaseRequest = {
  id: string;
  name: string;
  employee_role: EmployeeRole;
};

class UpdateEmployeeUseCase {
  constructor(private employeeRepository: EmployeeRepository) {}

  public async execute({
    id,
    name,
    employee_role,
  }: UpdateEmployeeUseCaseRequest): Promise<Either<NotFoundError, Employee>> {
    const employeeExists = await this.employeeRepository.findById(id);

    if (!employeeExists) {
      return failure(new NotFoundError(`Nenhum funcionário encontrado com o ID ${id}`));
    }

    employeeExists.setName(name);
    employeeExists.setEmployeeRole(employee_role);

    const employee = await this.employeeRepository.update(employeeExists);

    return success(employee);
  }
}

export { UpdateEmployeeUseCase };
