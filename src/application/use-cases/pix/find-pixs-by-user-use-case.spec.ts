import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { CreatePixUseCase } from "./create-pix-use-case";
import { CreateUserUseCase } from "../user";
import { InMemoryPixRepository } from "../../../infraestructure/repositories/in-memory/in-memory-pix-repository";
import { InMemoryUserRepository } from "../../../infraestructure/repositories/in-memory/in-memory-user-repository";
import { FindPixsByUserUseCase } from "./find-pixs-by-user-use-case";
import { describe, it, beforeEach, expect } from "vitest";

let pixRepository: InMemoryPixRepository;
let userRepository: InMemoryUserRepository;
let createPixUseCase: CreatePixUseCase;
let createUserUseCase: CreateUserUseCase;
let findPixsByUserUseCase: FindPixsByUserUseCase;
let bcryptAdapter: BcryptAdapter;

describe("get pixs by user", () => {
  beforeEach(() => {
    pixRepository = new InMemoryPixRepository();
    userRepository = new InMemoryUserRepository();
    bcryptAdapter = new BcryptAdapter();
    createPixUseCase = new CreatePixUseCase(pixRepository, userRepository);
    createUserUseCase = new CreateUserUseCase(userRepository, bcryptAdapter);
    findPixsByUserUseCase = new FindPixsByUserUseCase(pixRepository);
  });

  it("should be possible to get pixs by user", async () => {
    const user = await createUserUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "123456",
    });

    if (user.isFailure()) return;

    const id_user = user.value.id;

    await createPixUseCase.execute({ id_user });
    await createPixUseCase.execute({ id_user });

    const pixs = await findPixsByUserUseCase.execute({ id_user });

    expect(pixs.length).toBeGreaterThanOrEqual(2);
  });
});
