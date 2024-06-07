import { JwtAdapter } from "../../../infraestructure/token/token";
import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { NotFoundError } from "../errors/not-found-error";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { LoginDeliverymanUseCase } from "./login-deliveryman-use-case";
import { CreateDeliverymanUseCase } from "./create-deliveryman-use-case";
import { InMemoryDeliverymanRepository } from "../../../infraestructure/repositories/in-memory/in-memory-deliveryman-repository";
import { describe, it, expect, beforeEach } from "vitest";

let deliverymanRepository: InMemoryDeliverymanRepository;
let createDeliverymanUseCase: CreateDeliverymanUseCase;
let loginDeliverymanUseCase: LoginDeliverymanUseCase;
let bcryptAdapter: BcryptAdapter;
let jwtAdapter: JwtAdapter;

describe("login with deliveryman", () => {
  beforeEach(() => {
    deliverymanRepository = new InMemoryDeliverymanRepository();
    bcryptAdapter = new BcryptAdapter();
    jwtAdapter = new JwtAdapter();
    createDeliverymanUseCase = new CreateDeliverymanUseCase(deliverymanRepository, bcryptAdapter);
    loginDeliverymanUseCase = new LoginDeliverymanUseCase(
      deliverymanRepository,
      bcryptAdapter,
      jwtAdapter
    );
  });

  it("should be possible to login", async () => {
    await createDeliverymanUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "123456",
      birthday_date: new Date("2003-12-11"),
    });

    const deliveryman = await loginDeliverymanUseCase.execute({
      email: "matheus@gmail.com",
      password: "123456",
    });

    expect(deliveryman.isSuccess()).toBe(true);
  });

  it("should not be possible to login if the email is not found", async () => {
    await createDeliverymanUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "123456",
      birthday_date: new Date("2003-12-11"),
    });

    const deliveryman = await loginDeliverymanUseCase.execute({
      email: "notfound@gmail.com",
      password: "123456",
    });

    expect(deliveryman.isFailure()).toBe(true);
    expect(deliveryman.value).toBeInstanceOf(NotFoundError);
  });

  it("should not be possible to login if the password is incorrect", async () => {
    await createDeliverymanUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "123456",
      birthday_date: new Date("2003-12-11"),
    });

    const deliveryman = await loginDeliverymanUseCase.execute({
      email: "matheus@gmail.com",
      password: "123",
    });

    expect(deliveryman.isFailure()).toBe(true);
    expect(deliveryman.value).toBeInstanceOf(UnauthorizedError);
  });
});
