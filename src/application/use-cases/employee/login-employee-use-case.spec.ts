import { JwtAdapter } from "../../../infraestructure/token/token";
import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { NotFoundError } from "../errors/not-found-error";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { LoginEmployeeUseCase } from "./login-employee-use-case";
import { CreateEmployeeUseCase } from "./create-employee-use-case";
import { InMemoryEmployeeRepository } from "../../../infraestructure/repositories/in-memory/in-memory-employee-repository";
import { describe, expect, beforeEach, it } from "vitest";

let employeeRepository: InMemoryEmployeeRepository;
let createEmployeeUseCase: CreateEmployeeUseCase;
let loginEmployeeUseCase: LoginEmployeeUseCase;
let bcryptAdapter: BcryptAdapter;
let jwtAdapter: JwtAdapter;

describe("login with employee", () => {
  beforeEach(() => {
    employeeRepository = new InMemoryEmployeeRepository();
    bcryptAdapter = new BcryptAdapter();
    jwtAdapter = new JwtAdapter();
    createEmployeeUseCase = new CreateEmployeeUseCase(employeeRepository, bcryptAdapter);
    loginEmployeeUseCase = new LoginEmployeeUseCase(employeeRepository, bcryptAdapter, jwtAdapter);
  });

  it("should be possible to login", async () => {
    await createEmployeeUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "102030",
      employee_role: "Cozinheiro",
    });

    const employee = await loginEmployeeUseCase.execute({
      email: "matheus@gmail.com",
      password: "102030",
    });

    expect(employee.isSuccess()).toBe(true);
  });

  it("should not be possible to login if the email is not found", async () => {
    await createEmployeeUseCase.execute({
      name: "Matheus 1",
      email: "matheus@gmail.com",
      password: "102030",
      employee_role: "Garçom",
    });

    const employee = await loginEmployeeUseCase.execute({
      email: "notfound@gmail.com",
      password: "102030",
    });

    expect(employee.isFailure()).toBe(true);
    expect(employee.value).toBeInstanceOf(NotFoundError);
  });

  it("should not be possible to login if the password is incorrect", async () => {
    await createEmployeeUseCase.execute({
      name: "Matheus 1",
      email: "matheus@gmail.com",
      password: "102030",
      employee_role: "Garçom",
    });

    const employee = await loginEmployeeUseCase.execute({
      email: "matheus@gmail.com",
      password: "123",
    });

    expect(employee.isFailure()).toBe(true);
    expect(employee.value).toBeInstanceOf(UnauthorizedError);
  });
});
