import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { NotFoundError } from "../errors/not-found-error";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { CreateEmployeeUseCase } from "./create-employee-use-case";
import { UpdateEmployeeUseCase } from "./update-employee-use-case";
import { InMemoryEmployeeRepository } from "../../../infraestructure/repositories/in-memory/in-memory-employee-repository";
import { describe, expect, beforeEach, it } from "vitest";

let employeeRepository: InMemoryEmployeeRepository;
let createEmployeeUseCase: CreateEmployeeUseCase;
let updateEmployeeUseCase: UpdateEmployeeUseCase;
let bcryptAdapter: BcryptAdapter;

describe("update an employee", () => {
  beforeEach(() => {
    employeeRepository = new InMemoryEmployeeRepository();
    updateEmployeeUseCase = new UpdateEmployeeUseCase(employeeRepository);
    bcryptAdapter = new BcryptAdapter();
    createEmployeeUseCase = new CreateEmployeeUseCase(employeeRepository, bcryptAdapter);
  });

  it("should be possible to update an employee by id", async () => {
    const employeeCreated = await createEmployeeUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "102030",
      employee_role: "Cozinheiro",
    });

    if (employeeCreated.isFailure()) return;

    const id = employeeCreated.value.id;

    const employee = await updateEmployeeUseCase.execute({
      id,
      name: "Matheus",
      employee_role: "Garçom",
      id_employee: id,
    });

    expect(employee.isSuccess()).toBe(true);
  });

  it("should not be possible to update an employee if the id_employee is different the id", async () => {
    const employeeCreated = await createEmployeeUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "102030",
      employee_role: "Cozinheiro",
    });

    if (employeeCreated.isFailure()) return;

    const id = employeeCreated.value.id;

    const employee = await updateEmployeeUseCase.execute({
      id,
      name: "Matheus",
      employee_role: "Garçom",
      id_employee: "daiodjuhqj8d871819dmnlakd",
    });

    expect(employee.isFailure()).toBe(true);
    expect(employee.value).toBeInstanceOf(UnauthorizedError);
  });

  it("should not be possible to update an employee if the employee is not found", async () => {
    await createEmployeeUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "102030",
      employee_role: "Cozinheiro",
    });

    const employee = await updateEmployeeUseCase.execute({ id: "1892371u89321mdkaodmq" });

    expect(employee.isFailure()).toBe(true);
    expect(employee.value).toBeInstanceOf(NotFoundError);
  });
});
