import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { NotFoundError } from "../errors/not-found-error";
import { CreatePixUseCase } from "./create-pix-use-case";
import { CreateUserUseCase } from "../user";
import { FindPixByCodeUseCase } from "./find-pix-by-code-use-case";
import { InMemoryPixRepository } from "../../../infraestructure/repositories/in-memory/in-memory-pix-repository";
import { InMemoryUserRepository } from "../../../infraestructure/repositories/in-memory/in-memory-user-repository";
import { describe, it, beforeEach, expect } from "vitest";

let pixRepository: InMemoryPixRepository;
let userRepository: InMemoryUserRepository;
let createPixUseCase: CreatePixUseCase;
let createUserUseCase: CreateUserUseCase;
let findPixByCodeUseCase: FindPixByCodeUseCase;
let bcryptAdapter: BcryptAdapter;

describe("get pix by code", () => {
  beforeEach(() => {
    pixRepository = new InMemoryPixRepository();
    userRepository = new InMemoryUserRepository();
    bcryptAdapter = new BcryptAdapter();
    createPixUseCase = new CreatePixUseCase(pixRepository, userRepository);
    createUserUseCase = new CreateUserUseCase(userRepository, bcryptAdapter);
    findPixByCodeUseCase = new FindPixByCodeUseCase(pixRepository);
  });

  it("should be possible to get a pix by code", async () => {
    const user = await createUserUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "123456",
    });

    if (user.isFailure()) return;

    const id_user = user.value.id;

    const pixCreated = await createPixUseCase.execute({ id_user });

    if (pixCreated.isFailure()) return;

    const code = pixCreated.value.code;

    const pix = await findPixByCodeUseCase.execute({ code });

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

    const pix = await findPixByCodeUseCase.execute({ code: "aisdji1jd891j89admkadmao" });

    expect(pix.isFailure()).toBe(true);
    expect(pix.value).toBeInstanceOf(NotFoundError);
  });
});
