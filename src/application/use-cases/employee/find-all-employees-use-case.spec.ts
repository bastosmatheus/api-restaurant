import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { CreateEmployeeUseCase } from "./create-employee-use-case";
import { FindAllEmployeesUseCase } from "./find-all-employees-use-case";
import { InMemoryEmployeeRepository } from "../../../infraestructure/repositories/in-memory/in-memory-employee-repository";
import { describe, it, beforeEach, expect } from "vitest";

let employeeRepository: InMemoryEmployeeRepository;
let createEmployeeUseCase: CreateEmployeeUseCase;
let findAllEmployeesUseCase: FindAllEmployeesUseCase;
let bcryptAdapter: BcryptAdapter;

describe("get all employees", () => {
  beforeEach(() => {
    employeeRepository = new InMemoryEmployeeRepository();
    bcryptAdapter = new BcryptAdapter();
    createEmployeeUseCase = new CreateEmployeeUseCase(employeeRepository, bcryptAdapter);
    findAllEmployeesUseCase = new FindAllEmployeesUseCase(employeeRepository);
  });

  it("should be possible to get all employees", async () => {
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

    const employees = await findAllEmployeesUseCase.execute();

    expect(employees.length).toBeGreaterThanOrEqual(2);
  });
});
