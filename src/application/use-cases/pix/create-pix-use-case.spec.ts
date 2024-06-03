import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { NotFoundError } from "../errors/not-found-error";
import { CreatePixUseCase } from "./create-pix-use-case";
import { CreateUserUseCase } from "../user";
import { InMemoryPixRepository } from "../../../infraestructure/repositories/in-memory/in-memory-pix-repository";
import { InMemoryUserRepository } from "../../../infraestructure/repositories/in-memory/in-memory-user-repository";
import { describe, it, beforeEach, expect } from "vitest";

let pixRepository: InMemoryPixRepository;
let userRepository: InMemoryUserRepository;
let createPixUseCase: CreatePixUseCase;
let createUserUseCase: CreateUserUseCase;
let bcryptAdapter: BcryptAdapter;

describe("create a new pix", () => {
  beforeEach(() => {
    pixRepository = new InMemoryPixRepository();
    userRepository = new InMemoryUserRepository();
    bcryptAdapter = new BcryptAdapter();
    createPixUseCase = new CreatePixUseCase(pixRepository, userRepository);
    createUserUseCase = new CreateUserUseCase(userRepository, bcryptAdapter);
  });

  it("should be possible to create a pix", async () => {
    const user = await createUserUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "123456",
    });

    if (user.isFailure()) return;

    const id_user = user.value.id;

    const pix = await createPixUseCase.execute({ id_user });

    expect(pix.isSuccess()).toBe(true);
  });

  it("should not be possible to create a pix if the user is not found", async () => {
    await createUserUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "123456",
    });

    const pix = await createPixUseCase.execute({ id_user: "ad8981uhe781dnmakdmiaod901" });

    expect(pix.isFailure()).toBe(true);
    expect(pix.value).toBeInstanceOf(NotFoundError);
  });
});
