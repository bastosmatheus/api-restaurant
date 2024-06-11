import { Employee } from "../../../core/entities/employee";
import { NotFoundError } from "../errors/not-found-error";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { EmployeeRepository } from "../../../adapters/repositories/employee-repository";
import { Either, failure, success } from "../../../utils/either";

type DeleteEmployeeUseCaseRequest = {
  id: string;
  id_employee: string;
};

class DeleteEmployeeUseCase {
  constructor(private employeeRepository: EmployeeRepository) {}

  public async execute({
    id,
    id_employee,
  }: DeleteEmployeeUseCaseRequest): Promise<Either<NotFoundError | UnauthorizedError, Employee>> {
    const employeeExists = await this.employeeRepository.findById(id);

    if (!employeeExists) {
      return failure(new NotFoundError(`Nenhum funcionário encontrado com o ID: ${id}`));
    }

    if (id !== id_employee) {
      return failure(new UnauthorizedError(`Você não tem permissão para excluir esse funcionário`));
    }

    const employee = await this.employeeRepository.delete(id);

    return success(employee);
  }
}

export { DeleteEmployeeUseCase };
