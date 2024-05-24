import { NotFoundError } from "../errors/not-found-error";
import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { CreateEmployeeUseCase } from "./create-employee-use-case";
import { FindEmployeeByEmailUseCase } from "./find-employee-by-email-use-case";
import { InMemoryEmployeeRepository } from "../../../infraestructure/repositories/in-memory/in-memory-employee-repository";
import { describe, expect, beforeEach, it } from "vitest";

let employeeRepository: InMemoryEmployeeRepository;
let createEmployeeUseCase: CreateEmployeeUseCase;
let findEmployeeByEmailUseCase: FindEmployeeByEmailUseCase;
let bcryptAdapter: BcryptAdapter;

describe("get employee by email", () => {
  beforeEach(() => {
    employeeRepository = new InMemoryEmployeeRepository();
    bcryptAdapter = new BcryptAdapter();
    createEmployeeUseCase = new CreateEmployeeUseCase(employeeRepository, bcryptAdapter);
    findEmployeeByEmailUseCase = new FindEmployeeByEmailUseCase(employeeRepository);
  });

  it("should be possible to get an employee by email", async () => {
    const employeeCreated = await createEmployeeUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "102030",
      employee_role: "Cozinheiro",
    });

    if (employeeCreated.isFailure()) return;

    const email = employeeCreated.value.email;

    const employee = await findEmployeeByEmailUseCase.execute({ email });

    expect(employee.isSuccess()).toBe(true);
  });

  it("should not be possible to get an employee if the employee is not found", async () => {
    await createEmployeeUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "102030",
      employee_role: "Cozinheiro",
    });

    const employee = await findEmployeeByEmailUseCase.execute({ email: "emailerrado@gmail.com" });

    expect(employee.isFailure()).toBe(true);
    expect(employee.value).toBeInstanceOf(NotFoundError);
  });
});
