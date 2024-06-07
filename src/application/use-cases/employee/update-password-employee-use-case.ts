import { Employee } from "../../../core/entities/employee";
import { NotFoundError } from "../errors/not-found-error";
import { HasherAndCompare } from "../../../infraestructure/cryptography/cryptography";
import { EmployeeRepository } from "../../../adapters/repositories/employee-repository";
import { Either, failure, success } from "../../../utils/either";

type UpdatePasswordEmployeeUseCaseRequest = {
  id: string;
  password: string;
};

class UpdatePasswordEmployeeUseCase {
  constructor(
    private employeeRepository: EmployeeRepository,
    private hasher: HasherAndCompare
  ) {}

  public async execute({
    id,
    password,
  }: UpdatePasswordEmployeeUseCaseRequest): Promise<Either<NotFoundError, Employee>> {
    const employeeExists = await this.employeeRepository.findById(id);

    if (!employeeExists) {
      return failure(new NotFoundError(`Nenhum funcionário encontrado com o ID: ${id}`));
    }

    const passwordHashed = await this.hasher.hash(password);

    employeeExists.setPassword(passwordHashed);

    const employee = await this.employeeRepository.updatePassword(
      employeeExists.id,
      employeeExists.password
    );

    return success(employee);
  }
}

export { UpdatePasswordEmployeeUseCase };
