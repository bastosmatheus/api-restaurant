import { Hasher } from "../../../infraestructure/cryptography/cryptography";
import { Employee } from "../../../core/entities/employee";
import { NotFoundError } from "../errors/not-found-error";
import { EmployeeRepository } from "../../../adapters/repositories/employee-repository";
import { Either, failure, success } from "../../../utils/either";

type UpdatePasswordUseCaseRequest = {
  id: string;
  password: string;
};

class UpdatePasswordUseCase {
  constructor(
    private employeeRepository: EmployeeRepository,
    private hasher: Hasher
  ) {}

  public async execute({
    id,
    password,
  }: UpdatePasswordUseCaseRequest): Promise<Either<NotFoundError, Employee>> {
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

export { UpdatePasswordUseCase };
