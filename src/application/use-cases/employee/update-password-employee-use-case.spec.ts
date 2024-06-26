import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { NotFoundError } from "../errors/not-found-error";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { CreateEmployeeUseCase } from "./create-employee-use-case";
import { InMemoryEmployeeRepository } from "../../../infraestructure/repositories/in-memory/in-memory-employee-repository";
import { UpdatePasswordEmployeeUseCase } from "./update-password-employee-use-case";
import { describe, expect, beforeEach, it } from "vitest";

let employeeRepository: InMemoryEmployeeRepository;
let createEmployeeUseCase: CreateEmployeeUseCase;
let updatePasswordEmployeeUseCase: UpdatePasswordEmployeeUseCase;
let bcryptAdapter: BcryptAdapter;

describe("update an employee", () => {
  beforeEach(() => {
    employeeRepository = new InMemoryEmployeeRepository();
    bcryptAdapter = new BcryptAdapter();
    updatePasswordEmployeeUseCase = new UpdatePasswordEmployeeUseCase(
      employeeRepository,
      bcryptAdapter
    );
    createEmployeeUseCase = new CreateEmployeeUseCase(employeeRepository, bcryptAdapter);
  });

  it("should be possible to update an employee password by id", async () => {
    const employeeCreated = await createEmployeeUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "102030",
      employee_role: "Cozinheiro",
    });

    if (employeeCreated.isFailure()) return;

    const id = employeeCreated.value.id;

    const employee = await updatePasswordEmployeeUseCase.execute({
      id,
      password: "12345",
      id_employee: id,
    });

    expect(employee.isSuccess()).toBe(true);
  });

  it("should not be possible to update an employee if the id_employee is differente the id", async () => {
    const employeeCreated = await createEmployeeUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "102030",
      employee_role: "Cozinheiro",
    });

    if (employeeCreated.isFailure()) return;

    const id = employeeCreated.value.id;

    const employee = await updatePasswordEmployeeUseCase.execute({
      id,
      password: "12345",
      id_employee: "ca9ijdh89adj89qj89",
    });

    expect(employee.isFailure()).toBe(true);
    expect(employee.value).toBeInstanceOf(UnauthorizedError);
  });

  it("should be possible to update an employee password if the employee is not found", async () => {
    await createEmployeeUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "102030",
      employee_role: "Cozinheiro",
    });

    const employee = await updatePasswordEmployeeUseCase.execute({ id: "1892371u89321mdkaodmq" });

    expect(employee.isFailure()).toBe(true);
    expect(employee.value).toBeInstanceOf(NotFoundError);
  });
});
