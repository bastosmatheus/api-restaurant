import { JwtAdapter } from "../../../infraestructure/token/token";
import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { NotFoundError } from "../errors/not-found-error";
import { LoginUserUseCase } from "./login-user-use-case";
import { CreateUserUseCase } from "./create-user-use-case";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { InMemoryUserRepository } from "../../../infraestructure/repositories/in-memory/in-memory-user-repository";
import { describe, it, beforeEach, expect } from "vitest";

let userRepository: InMemoryUserRepository;
let bcryptAdapter: BcryptAdapter;
let createUserUseCase: CreateUserUseCase;
let loginUserUseCase: LoginUserUseCase;
let jwtAdapter: JwtAdapter;

describe("login with user", () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    bcryptAdapter = new BcryptAdapter();
    jwtAdapter = new JwtAdapter();
    createUserUseCase = new CreateUserUseCase(userRepository, bcryptAdapter);
    loginUserUseCase = new LoginUserUseCase(userRepository, bcryptAdapter, jwtAdapter);
  });

  it("should be possible to login", async () => {
    await createUserUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345",
    });

    const user = await loginUserUseCase.execute({
      email: "matheus@gmail.com",
      password: "12345",
    });

    expect(user.isSuccess()).toBe(true);
  });

  it("should not be possible to login if the email is not found", async () => {
    await createUserUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345",
    });

    const user = await loginUserUseCase.execute({
      email: "notfound@gmail.com",
      password: "12345",
    });

    expect(user.isFailure()).toBe(true);
    expect(user.value).toBeInstanceOf(NotFoundError);
  });

  it("should not be possible to login ff the password is incorrect", async () => {
    await createUserUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345",
    });

    const user = await loginUserUseCase.execute({
      email: "matheus@gmail.com",
      password: "102030",
    });

    expect(user.isFailure()).toBe(true);
    expect(user.value).toBeInstanceOf(UnauthorizedError);
  });
});
