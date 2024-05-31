import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { CreateUserUseCase } from "./create-user-use-case";
import { UpdateUserUseCase } from "./update-user-use-case";
import { InMemoryUserRepository } from "../../../infraestructure/repositories/in-memory/in-memory-user-repository";
import { describe, it, beforeEach, expect } from "vitest";
import { NotFoundError } from "../errors/not-found-error";

let userRepository: InMemoryUserRepository;
let bcryptAdapter: BcryptAdapter;
let createUserUseCase: CreateUserUseCase;
let updateUserUseCase: UpdateUserUseCase;

describe("update a user", () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    bcryptAdapter = new BcryptAdapter();
    createUserUseCase = new CreateUserUseCase(userRepository, bcryptAdapter);
    updateUserUseCase = new UpdateUserUseCase(userRepository);
  });

  it("should be possible to update a user by id", async () => {
    const userCreated = await createUserUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345",
    });

    if (userCreated.isFailure()) return;

    const id = userCreated.value.id;

    const user = await updateUserUseCase.execute({
      id,
      name: "Roberto",
    });

    expect(user.isSuccess()).toBe(true);
  });

  it("should not be possible to update a user if the user is not found", async () => {
    await createUserUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345",
    });

    const user = await updateUserUseCase.execute({
      id: "98dankldnmoiqdpqod",
    });

    expect(user.isFailure()).toBe(true);
    expect(user.value).toBeInstanceOf(NotFoundError);
  });
});
