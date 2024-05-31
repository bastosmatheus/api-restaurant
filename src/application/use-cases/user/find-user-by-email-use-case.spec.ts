import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { NotFoundError } from "../errors/not-found-error";
import { CreateUserUseCase } from "./create-user-use-case";
import { InMemoryUserRepository } from "../../../infraestructure/repositories/in-memory/in-memory-user-repository";
import { FindUserByEmailUseCase } from "./find-user-by-email-use-case";
import { describe, it, beforeEach, expect } from "vitest";

let userRepository: InMemoryUserRepository;
let bcryptAdapter: BcryptAdapter;
let createUserUseCase: CreateUserUseCase;
let findUserByEmailUseCase: FindUserByEmailUseCase;

describe("get user by email", () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    bcryptAdapter = new BcryptAdapter();
    createUserUseCase = new CreateUserUseCase(userRepository, bcryptAdapter);
    findUserByEmailUseCase = new FindUserByEmailUseCase(userRepository);
  });

  it("should be possible to get a user by email", async () => {
    const userCreated = await createUserUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345",
    });

    if (userCreated.isFailure()) return;

    const email = userCreated.value.email;

    const user = await findUserByEmailUseCase.execute({
      email,
    });

    expect(user.isSuccess()).toBe(true);
  });

  it("should not be possible to find a user if the user is not found", async () => {
    await createUserUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345",
    });

    const user = await findUserByEmailUseCase.execute({
      email: "emailerrado@gmail.com",
    });

    expect(user.isFailure()).toBe(true);
    expect(user.value).toBeInstanceOf(NotFoundError);
  });
});
