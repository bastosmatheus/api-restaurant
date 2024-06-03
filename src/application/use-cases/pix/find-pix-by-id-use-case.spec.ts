import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { NotFoundError } from "../errors/not-found-error";
import { CreatePixUseCase } from "./create-pix-use-case";
import { CreateUserUseCase } from "../user";
import { FindPixByIdUseCase } from "./find-pix-by-id-use-case";
import { InMemoryPixRepository } from "../../../infraestructure/repositories/in-memory/in-memory-pix-repository";
import { InMemoryUserRepository } from "../../../infraestructure/repositories/in-memory/in-memory-user-repository";
import { describe, it, beforeEach, expect } from "vitest";

let pixRepository: InMemoryPixRepository;
let userRepository: InMemoryUserRepository;
let createPixUseCase: CreatePixUseCase;
let createUserUseCase: CreateUserUseCase;
let findPixByIdUseCase: FindPixByIdUseCase;
let bcryptAdapter: BcryptAdapter;

describe("get pix by id", () => {
  beforeEach(() => {
    pixRepository = new InMemoryPixRepository();
    userRepository = new InMemoryUserRepository();
    bcryptAdapter = new BcryptAdapter();
    createPixUseCase = new CreatePixUseCase(pixRepository, userRepository);
    createUserUseCase = new CreateUserUseCase(userRepository, bcryptAdapter);
    findPixByIdUseCase = new FindPixByIdUseCase(pixRepository);
  });

  it("should be possible to get a pix by id", async () => {
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

    const pix = await findPixByIdUseCase.execute({ id });

    expect(pix.isSuccess()).toBe(true);
  });

  it("should not be possible to get a pix if the pix is not found", async () => {
    const user = await createUserUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "123456",
    });

    if (user.isFailure()) return;

    const id_user = user.value.id;

    await createPixUseCase.execute({ id_user });

    const pix = await findPixByIdUseCase.execute({ id: "aisdji1jd891j89admkadmao" });

    expect(pix.isFailure()).toBe(true);
    expect(pix.value).toBeInstanceOf(NotFoundError);
  });
});
