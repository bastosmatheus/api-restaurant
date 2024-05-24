import { NotFoundError } from "../errors/not-found-error";
import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { CreateEmployeeUseCase } from "./create-employee-use-case";
import { FindEmployeeByIdUseCase } from "./find-employee-by-id-use-case";
import { InMemoryEmployeeRepository } from "../../../infraestructure/repositories/in-memory/in-memory-employee-repository";
import { describe, expect, beforeEach, it } from "vitest";

let employeeRepository: InMemoryEmployeeRepository;
let createEmployeeUseCase: CreateEmployeeUseCase;
let findEmployeeByIdUseCase: FindEmployeeByIdUseCase;
let bcryptAdapter: BcryptAdapter;

describe("get employee by id", () => {
  beforeEach(() => {
    employeeRepository = new InMemoryEmployeeRepository();
    bcryptAdapter = new BcryptAdapter();
    createEmployeeUseCase = new CreateEmployeeUseCase(employeeRepository, bcryptAdapter);
    findEmployeeByIdUseCase = new FindEmployeeByIdUseCase(employeeRepository);
  });

  it("should be possible to get an employee by id", async () => {
    const employeeCreated = await createEmployeeUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "102030",
      employee_role: "Cozinheiro",
    });

    if (employeeCreated.isFailure()) return;

    const id = employeeCreated.value.id;

    const employee = await findEmployeeByIdUseCase.execute({ id });

    expect(employee.isSuccess()).toBe(true);
  });

  it("should not be possible to get an employee if the employee is not found", async () => {
    await createEmployeeUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "102030",
      employee_role: "Cozinheiro",
    });

    const employee = await findEmployeeByIdUseCase.execute({ id: "19djaokjsdnui1102381-daonsmdo" });

    expect(employee.isFailure()).toBe(true);
    expect(employee.value).toBeInstanceOf(NotFoundError);
  });
});
