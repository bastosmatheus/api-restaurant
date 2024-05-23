import { Hasher } from "../../../infraestructure/cryptography/cryptography";
import { NotFoundError } from "../errors/not-found-error";
import { failure, success } from "../../../utils/either";
import { EmployeeRepository } from "../../../adapters/repositories/employee-repository";

type UpdatePasswordUseCaseRequest = {
  id: string;
  newPassword: string;
};

class UpdatePasswordUseCase {
  constructor(
    private employeeRepository: EmployeeRepository,
    private hasher: Hasher
  ) {}

  public async execute({ id, newPassword }: UpdatePasswordUseCaseRequest) {
    const employeeExists = await this.employeeRepository.findById(id);

    if (!employeeExists) {
      return failure(new NotFoundError(`Nenhum funcionário encontrado com o ID: ${id}`));
    }

    const passwordHashed = await this.hasher.hash(newPassword);

    employeeExists.setPassword(passwordHashed);

    const employee = this.employeeRepository.update(employeeExists);

    return success(employee);
  }
}

export { UpdatePasswordUseCase };
