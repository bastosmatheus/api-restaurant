import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { NotFoundError } from "../errors/not-found-error";
import { CreateUserUseCase } from "./create-user-use-case";
import { FindUserByIdUseCase } from "./find-user-by-id-use-case";
import { InMemoryUserRepository } from "../../../infraestructure/repositories/in-memory/in-memory-user-repository";
import { describe, it, beforeEach, expect } from "vitest";

let userRepository: InMemoryUserRepository;
let bcryptAdapter: BcryptAdapter;
let createUserUseCase: CreateUserUseCase;
let findUserByIdUseCase: FindUserByIdUseCase;

describe("get user by id", () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    bcryptAdapter = new BcryptAdapter();
    createUserUseCase = new CreateUserUseCase(userRepository, bcryptAdapter);
    findUserByIdUseCase = new FindUserByIdUseCase(userRepository);
  });

  it("should be possible to get a user by id", async () => {
    const userCreated = await createUserUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345",
    });

    if (userCreated.isFailure()) return;

    const id = userCreated.value.id;

    const user = await findUserByIdUseCase.execute({
      id,
    });

    expect(user.isSuccess()).toBe(true);
  });

  it("should not be possible to find a user if the user is not found", async () => {
    await createUserUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345",
    });

    const user = await findUserByIdUseCase.execute({
      id: "12903dklamoqwkdopqodijhuihiuda2781",
    });

    expect(user.isFailure()).toBe(true);
    expect(user.value).toBeInstanceOf(NotFoundError);
  });
});
