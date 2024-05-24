import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { CreateEmployeeUseCase } from "./create-employee-use-case";
import { FindEmployeesByRoleUseCase } from "./find-employees-by-role-use-case";
import { InMemoryEmployeeRepository } from "../../../infraestructure/repositories/in-memory/in-memory-employee-repository";
import { describe, it, beforeEach, expect } from "vitest";

let employeeRepository: InMemoryEmployeeRepository;
let createEmployeeUseCase: CreateEmployeeUseCase;
let findEmployeesByRoleUseCase: FindEmployeesByRoleUseCase;
let bcryptAdapter: BcryptAdapter;

describe("get employees by role", () => {
  beforeEach(() => {
    employeeRepository = new InMemoryEmployeeRepository();
    bcryptAdapter = new BcryptAdapter();
    createEmployeeUseCase = new CreateEmployeeUseCase(employeeRepository, bcryptAdapter);
    findEmployeesByRoleUseCase = new FindEmployeesByRoleUseCase(employeeRepository);
  });

  it("should be possible to get employees by role", async () => {
    await createEmployeeUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "102030",
      employee_role: "Cozinheiro",
    });

    await createEmployeeUseCase.execute({
      name: "Rogerio",
      email: "rogerio@gmail.com",
      password: "123456",
      employee_role: "Gerente",
    });

    await createEmployeeUseCase.execute({
      name: "Luis",
      email: "luis@gmail.com",
      password: "123",
      employee_role: "Cozinheiro",
    });

    const employees = await findEmployeesByRoleUseCase.execute({ employee_role: "Cozinheiro" });

    expect(employees.length).toBeGreaterThanOrEqual(2);
  });
});
