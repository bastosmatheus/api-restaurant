import { Employee } from "../../../core/entities/employee";
import { NotFoundError } from "../errors/not-found-error";
import { EmployeeRepository } from "../../../adapters/repositories/employee-repository";
import { Either, failure, success } from "../../../utils/either";

type DeleteEmployeeUseCaseRequest = {
  id: string;
};

class DeleteEmployeeUseCase {
  constructor(private employeeRepository: EmployeeRepository) {}

  public async execute({
    id,
  }: DeleteEmployeeUseCaseRequest): Promise<Either<NotFoundError, Employee>> {
    const employeeExists = await this.employeeRepository.findById(id);

    if (!employeeExists) {
      return failure(new NotFoundError(`Nenhum funcionário encontrado com o ID: ${id}`));
    }

    const employee = await this.employeeRepository.delete(id);

    return success(employee);
  }
}

export { DeleteEmployeeUseCase };
