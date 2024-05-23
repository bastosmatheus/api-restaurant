import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { CreateEmployeeUseCase } from "./create-employee-use-case";
import { InMemoryEmployeeRepository } from "../../../infraestructure/repositories/in-memory/in-memory-employee-repository";
import { describe, expect, beforeEach, it } from "vitest";
import { EmployeeRole } from "../../../core/entities/employee";
import { Success } from "../../../utils/either";

let employeeRepository: InMemoryEmployeeRepository;
let createEmployeeUseCase: CreateEmployeeUseCase;
let bcryptAdapter: BcryptAdapter;

describe("create a new employee", () => {
  beforeEach(() => {
    employeeRepository = new InMemoryEmployeeRepository();
    bcryptAdapter = new BcryptAdapter();
    createEmployeeUseCase = new CreateEmployeeUseCase(employeeRepository, bcryptAdapter);
  });

  it("should be possible to create a employee", async () => {
    const employee = await createEmployeeUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "102030",
      employee_role: EmployeeRole.WAITER,
    });

    console.log(employee);

    expect(employee).toBeInstanceOf(Success);
  });
});
