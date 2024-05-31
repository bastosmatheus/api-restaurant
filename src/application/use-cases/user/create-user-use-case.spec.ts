import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { ConflictError } from "../errors/conflict-error";
import { CreateUserUseCase } from "./create-user-use-case";
import { InMemoryUserRepository } from "../../../infraestructure/repositories/in-memory/in-memory-user-repository";
import { describe, it, beforeEach, expect } from "vitest";

let userRepository: InMemoryUserRepository;
let bcryptAdapter: BcryptAdapter;
let createUserUseCase: CreateUserUseCase;

describe("create a new user", () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    bcryptAdapter = new BcryptAdapter();
    createUserUseCase = new CreateUserUseCase(userRepository, bcryptAdapter);
  });

  it("should be possible to create a user", async () => {
    const user = await createUserUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345",
    });

    expect(user.isSuccess()).toBe(true);
  });

  it("should not be possible to create a user if the email already exists", async () => {
    await createUserUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345",
    });

    const user = await createUserUseCase.execute({
      name: "Matheus2",
      email: "matheus@gmail.com",
      password: "102030",
    });

    expect(user.isFailure()).toBe(true);
    expect(user.value).toBeInstanceOf(ConflictError);
  });
});
