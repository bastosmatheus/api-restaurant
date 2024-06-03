import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { CreatePixUseCase } from "./create-pix-use-case";
import { CreateUserUseCase } from "../user";
import { InMemoryPixRepository } from "../../../infraestructure/repositories/in-memory/in-memory-pix-repository";
import { InMemoryUserRepository } from "../../../infraestructure/repositories/in-memory/in-memory-user-repository";
import { UpdateStatusPixUseCase } from "./update-status-pix-use-case";
import { describe, it, beforeEach, expect } from "vitest";
import { NotFoundError } from "../errors/not-found-error";

let pixRepository: InMemoryPixRepository;
let userRepository: InMemoryUserRepository;
let createPixUseCase: CreatePixUseCase;
let createUserUseCase: CreateUserUseCase;
let updateStatusPixUseCase: UpdateStatusPixUseCase;
let bcryptAdapter: BcryptAdapter;

describe("update pix status", () => {
  beforeEach(() => {
    pixRepository = new InMemoryPixRepository();
    userRepository = new InMemoryUserRepository();
    bcryptAdapter = new BcryptAdapter();
    createPixUseCase = new CreatePixUseCase(pixRepository, userRepository);
    createUserUseCase = new CreateUserUseCase(userRepository, bcryptAdapter);
    updateStatusPixUseCase = new UpdateStatusPixUseCase(pixRepository);
  });

  it("should be possible to update a pix status", async () => {
    const user = await createUserUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "123456",
    });

    if (user.isFailure()) return;

    const id_user = user.value.id;

    const pixCreated = await createPixUseCase.execute({ id_user });

    if (pixCreated.isFailure()) return;

    const id = pixCreated.value.id;

    const pix = await updateStatusPixUseCase.execute({ id });

    expect(pix.isSuccess()).toBe(true);
  });

  it("should not be possible to update a pix status", async () => {
    const user = await createUserUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "123456",
    });

    if (user.isFailure()) return;

    const id_user = user.value.id;

    await createPixUseCase.execute({ id_user });

    const pix = await updateStatusPixUseCase.execute({ id: "d98aud8912udq0dmlqdm01093819" });

    expect(pix.isFailure()).toBe(true);
    expect(pix.value).toBeInstanceOf(NotFoundError);
  });
});
