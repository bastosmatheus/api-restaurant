import { Token } from "../../../infraestructure/token/token";
import { NotFoundError } from "../errors/not-found-error";
import { HasherAndCompare } from "../../../infraestructure/cryptography/cryptography";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { EmployeeRepository } from "../../../adapters/repositories/employee-repository";
import { Either, failure, success } from "../../../utils/either";

type LoginEmployeeUseCaseRequest = {
  email: string;
  password: string;
};

class LoginEmployeeUseCase {
  constructor(
    private employeeRepository: EmployeeRepository,
    private compare: HasherAndCompare,
    private token: Token
  ) {}

  public async execute({
    email,
    password,
  }: LoginEmployeeUseCaseRequest): Promise<Either<NotFoundError | UnauthorizedError, string>> {
    const employee = await this.employeeRepository.findByEmail(email);

    if (!employee) {
      return failure(new NotFoundError(`Email incorreto`));
    }

    const checkPassword = await this.compare.compare(password, employee.password);

    if (!checkPassword) {
      return failure(new UnauthorizedError(`Senha incorreta`));
    }

    const token = await this.token.sign({
      name: employee.name,
      email: employee.email,
      employee_role: employee.employee_role,
      id_employee: employee.id,
    });

    return success(token);
  }
}

export { LoginEmployeeUseCase };
