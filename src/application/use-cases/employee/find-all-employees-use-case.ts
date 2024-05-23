import { Employee } from "../../../core/entities/employee";
import { EmployeeRepository } from "../../../adapters/repositories/employee-repository";

class FindAllEmployeesUseCase {
  constructor(private employeeRepository: EmployeeRepository) {}

  public async execute(): Promise<Employee[]> {
    const employees = await this.employeeRepository.findAll();

    return employees;
  }
}

export { FindAllEmployeesUseCase };
