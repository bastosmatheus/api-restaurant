import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { ConflictError } from "../errors/conflict-error";
import { CreateDeliverymanUseCase } from "./create-deliveryman-use-case";
import { InMemoryDeliverymanRepository } from "../../../infraestructure/repositories/in-memory/in-memory-deliveryman-repository";
import { describe, it, expect, beforeEach } from "vitest";

let deliverymanRepository: InMemoryDeliverymanRepository;
let createDeliverymanUseCase: CreateDeliverymanUseCase;
let bcryptAdapter: BcryptAdapter;

describe("create a new deliveryman", () => {
  beforeEach(() => {
    deliverymanRepository = new InMemoryDeliverymanRepository();
    bcryptAdapter = new BcryptAdapter();
    createDeliverymanUseCase = new CreateDeliverymanUseCase(deliverymanRepository, bcryptAdapter);
  });

  it("should be possible to create a deliveryman", async () => {
    const deliveryman = await createDeliverymanUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "123456",
      birthday_date: new Date("2003-12-11"),
    });

    expect(deliveryman.isSuccess()).toBe(true);
  });

  it("should not be possible to create a deliveryman if the email already exists", async () => {
    await createDeliverymanUseCase.execute({
      name: "Matheus 1",
      email: "matheus@gmail.com",
      password: "123456",
      birthday_date: new Date("2003-12-11"),
    });

    const deliveryman = await createDeliverymanUseCase.execute({
      name: "Matheus 2",
      email: "matheus@gmail.com",
      password: "102030",
      birthday_date: new Date("2002-09-10"),
    });

    expect(deliveryman.isFailure()).toBe(true);
    expect(deliveryman.value).toBeInstanceOf(ConflictError);
  });
});
