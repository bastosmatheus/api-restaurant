import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { NotFoundError } from "../errors/not-found-error";
import { CreateUserUseCase } from "./create-user-use-case";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { InMemoryUserRepository } from "../../../infraestructure/repositories/in-memory/in-memory-user-repository";
import { UpdatePasswordUserUseCase } from "./update-password-user-use-case";
import { describe, it, beforeEach, expect } from "vitest";

let userRepository: InMemoryUserRepository;
let bcryptAdapter: BcryptAdapter;
let createUserUseCase: CreateUserUseCase;
let updatePasswordUserUseCase: UpdatePasswordUserUseCase;

describe("update password user", () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    bcryptAdapter = new BcryptAdapter();
    createUserUseCase = new CreateUserUseCase(userRepository, bcryptAdapter);
    updatePasswordUserUseCase = new UpdatePasswordUserUseCase(userRepository, bcryptAdapter);
  });

  it("should be possible to update a password user by id", async () => {
    const userCreated = await createUserUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345",
    });

    if (userCreated.isFailure()) return;

    const id = userCreated.value.id;

    const user = await updatePasswordUserUseCase.execute({
      id,
      password: "102030",
      id_user: id,
    });

    expect(user.isSuccess()).toBe(true);
  });

  it("should not be possible to update a password if the id_user is different the id", async () => {
    const userCreated = await createUserUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345",
    });

    if (userCreated.isFailure()) return;

    const id = userCreated.value.id;

    const user = await updatePasswordUserUseCase.execute({
      id,
      password: "102030",
      id_user: "doqijdiuoqmdio18923u1dm oidjaioda",
    });

    expect(user.isFailure()).toBe(true);
    expect(user.value).toBeInstanceOf(UnauthorizedError);
  });

  it("should be possible to update a password user by id", async () => {
    await createUserUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345",
    });

    const user = await updatePasswordUserUseCase.execute({ id: "1290danjidoqmdqiodmi" });

    expect(user.isFailure()).toBe(true);
    expect(user.value).toBeInstanceOf(NotFoundError);
  });
});
