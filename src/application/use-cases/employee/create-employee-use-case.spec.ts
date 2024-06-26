import { ConflictError } from "../errors/conflict-error";
import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { CreateEmployeeUseCase } from "./create-employee-use-case";
import { InMemoryEmployeeRepository } from "../../../infraestructure/repositories/in-memory/in-memory-employee-repository";
import { describe, expect, beforeEach, it } from "vitest";

let employeeRepository: InMemoryEmployeeRepository;
let createEmployeeUseCase: CreateEmployeeUseCase;
let bcryptAdapter: BcryptAdapter;

describe("create a new employee", () => {
  beforeEach(() => {
    employeeRepository = new InMemoryEmployeeRepository();
    bcryptAdapter = new BcryptAdapter();
    createEmployeeUseCase = new CreateEmployeeUseCase(employeeRepository, bcryptAdapter);
  });

  it("should be possible to create an employee", async () => {
    const employee = await createEmployeeUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "102030",
      employee_role: "Cozinheiro",
    });

    expect(employee.isSuccess()).toBe(true);
  });

  it("should not be possible to create an employee if the email already exists", async () => {
    await createEmployeeUseCase.execute({
      name: "Matheus 1",
      email: "matheus@gmail.com",
      password: "102030",
      employee_role: "Garçom",
    });

    const employee = await createEmployeeUseCase.execute({
      name: "Matheus 2",
      email: "matheus@gmail.com",
      password: "123456",
      employee_role: "Gerente",
    });

    expect(employee.isFailure()).toBe(true);
    expect(employee.value).toBeInstanceOf(ConflictError);
  });
});
