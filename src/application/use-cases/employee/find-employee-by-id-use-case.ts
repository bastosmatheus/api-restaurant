import { Employee } from "../../../core/entities/employee";
import { NotFoundError } from "../errors/not-found-error";
import { EmployeeRepository } from "../../../adapters/repositories/employee-repository";
import { Either, failure, success } from "../../../utils/either";

type FindEmployeeByIdUseCaseRequest = {
  id: string;
};

class FindEmployeeByIdUseCase {
  constructor(private employeeRepository: EmployeeRepository) {}

  public async execute({
    id,
  }: FindEmployeeByIdUseCaseRequest): Promise<Either<NotFoundError, Employee>> {
    const employee = await this.employeeRepository.findById(id);

    if (!employee) {
      return failure(new NotFoundError(`Nenhum funcionário encontrado com o ID: ${id}`));
    }

    return success(employee);
  }
}

export { FindEmployeeByIdUseCase };
