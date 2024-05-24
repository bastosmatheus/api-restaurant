import { NotFoundError } from "../errors/not-found-error";
import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { DeleteEmployeeUseCase } from "./delete-employee-use-case";
import { CreateEmployeeUseCase } from "./create-employee-use-case";
import { InMemoryEmployeeRepository } from "../../../infraestructure/repositories/in-memory/in-memory-employee-repository";
import { describe, expect, beforeEach, it } from "vitest";

let employeeRepository: InMemoryEmployeeRepository;
let createEmployeeUseCase: CreateEmployeeUseCase;
let deleteEmployeeUseCase: DeleteEmployeeUseCase;
let bcryptAdapter: BcryptAdapter;

describe("delete an employee by id", () => {
  beforeEach(() => {
    employeeRepository = new InMemoryEmployeeRepository();
    bcryptAdapter = new BcryptAdapter();
    createEmployeeUseCase = new CreateEmployeeUseCase(employeeRepository, bcryptAdapter);
    deleteEmployeeUseCase = new DeleteEmployeeUseCase(employeeRepository);
  });

  it("should be possible to delete an employee by id", async () => {
    const employeeCreated = await createEmployeeUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "102030",
      employee_role: "Cozinheiro",
    });

    if (employeeCreated.isFailure()) return;

    const id = employeeCreated.value.id;

    const employee = await deleteEmployeeUseCase.execute({ id });

    expect(employee.isSuccess()).toBe(true);
  });

  it("should not be possible to delete an employee if the employee is not found", async () => {
    await createEmployeeUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "102030",
      employee_role: "Cozinheiro",
    });

    const employee = await deleteEmployeeUseCase.execute({ id: "12031903281390" });

    expect(employee.isFailure()).toBe(true);
    expect(employee.value).toBeInstanceOf(NotFoundError);
  });
});
