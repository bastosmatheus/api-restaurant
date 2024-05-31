import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { CreateUserUseCase } from "./create-user-use-case";
import { FindAllUsersUseCase } from "./find-all-users-use-case";
import { InMemoryUserRepository } from "../../../infraestructure/repositories/in-memory/in-memory-user-repository";
import { describe, it, beforeEach, expect } from "vitest";

let userRepository: InMemoryUserRepository;
let bcryptAdapter: BcryptAdapter;
let createUserUseCase: CreateUserUseCase;
let findAllUsersUseCase: FindAllUsersUseCase;

describe("get all users", () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    bcryptAdapter = new BcryptAdapter();
    createUserUseCase = new CreateUserUseCase(userRepository, bcryptAdapter);
    findAllUsersUseCase = new FindAllUsersUseCase(userRepository);
  });

  it("should be possible to get all users", async () => {
    await createUserUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345",
    });

    await createUserUseCase.execute({
      name: "Lucas",
      email: "lucas@gmail.com",
      password: "102030",
    });

    const users = await findAllUsersUseCase.execute();

    expect(users.length).toBeGreaterThanOrEqual(2);
  });
});
