import { Hasher } from "../../../infraestructure/cryptography/cryptography";
import { ConflictError } from "../errors/conflict-error";
import { EmployeeRepository } from "../../../adapters/repositories/employee-repository";
import { Employee, EmployeeRole } from "../../../core/entities/employee";
import { Either, failure, success } from "../../../utils/either";

type CreateEmployeeUseCaseRequest = {
  name: string;
  email: string;
  password: string;
  employee_role: EmployeeRole;
};

class CreateEmployeeUseCase {
  constructor(
    private employeeRepository: EmployeeRepository,
    private hasher: Hasher
  ) {}

  public async execute({
    name,
    email,
    password,
    employee_role,
  }: CreateEmployeeUseCaseRequest): Promise<Either<ConflictError, Employee>> {
    const emailAlreadyExists = await this.employeeRepository.findByEmail(email);

    if (emailAlreadyExists) {
      return failure(new ConflictError(`Esse email já está em uso`));
    }

    const passwordHashed = await this.hasher.hash(password);

    const employeeCreated = Employee.create(name, email, passwordHashed, employee_role);

    const employee = await this.employeeRepository.create(employeeCreated);

    return success(employee);
  }
}

export { CreateEmployeeUseCase };
