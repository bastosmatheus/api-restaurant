import { Employee } from "../../../core/entities/employee";
import { NotFoundError } from "../errors/not-found-error";
import { HasherAndCompare } from "../../../infraestructure/cryptography/cryptography";
import { EmployeeRepository } from "../../../adapters/repositories/employee-repository";
import { Either, failure, success } from "../../../utils/either";
import { UnauthorizedError } from "../errors/unauthorized-error";

type UpdatePasswordEmployeeUseCaseRequest = {
  id: string;
  password: string;
  id_employee: string;
};

class UpdatePasswordEmployeeUseCase {
  constructor(
    private employeeRepository: EmployeeRepository,
    private hasher: HasherAndCompare
  ) {}

  public async execute({
    id,
    password,
    id_employee,
  }: UpdatePasswordEmployeeUseCaseRequest): Promise<
    Either<NotFoundError | UnauthorizedError, Employee>
  > {
    const employeeExists = await this.employeeRepository.findById(id);

    if (!employeeExists) {
      return failure(new NotFoundError(`Nenhum funcionário encontrado com o ID: ${id}`));
    }

    if (id !== id_employee) {
      return failure(
        new UnauthorizedError(`Você não tem permissão para atualizar esse funcionário`)
      );
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
