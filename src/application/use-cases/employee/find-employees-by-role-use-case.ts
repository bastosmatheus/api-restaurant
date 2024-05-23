import { EmployeeRepository } from "../../../adapters/repositories/employee-repository";
import { Employee, EmployeeRole } from "../../../core/entities/employee";

type FindEmployeesByRoleUseCaseRequest = {
  employee_role: EmployeeRole;
};

class FindEmployeesByRoleUseCase {
  constructor(private employeeRepository: EmployeeRepository) {}

  public async execute({ employee_role }: FindEmployeesByRoleUseCaseRequest): Promise<Employee[]> {
    const employees = await this.employeeRepository.findByRole(employee_role);

    return employees;
  }
}

export { FindEmployeesByRoleUseCase };
