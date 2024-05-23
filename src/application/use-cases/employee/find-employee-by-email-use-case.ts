import { Employee } from "../../../core/entities/employee";
import { NotFoundError } from "../errors/not-found-error";
import { EmployeeRepository } from "../../../adapters/repositories/employee-repository";
import { Either, failure, success } from "../../../utils/either";

type FindEmployeeByEmailUseCaseRequest = {
  email: string;
};

class FindEmployeeByEmailUseCase {
  constructor(private employeeRepository: EmployeeRepository) {}

  public async execute({
    email,
  }: FindEmployeeByEmailUseCaseRequest): Promise<Either<NotFoundError, Employee>> {
    const employee = await this.employeeRepository.findByEmail(email);

    if (!employee) {
      return failure(new NotFoundError(`Nenhum funcionário encontrado com o email: ${email}`));
    }

    return success(employee);
  }
}

export { FindEmployeeByEmailUseCase };
