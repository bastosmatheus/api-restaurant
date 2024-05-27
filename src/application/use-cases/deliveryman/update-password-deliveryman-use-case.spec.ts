import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { NotFoundError } from "../errors/not-found-error";
import { UpdatePasswordDeliverymanUseCase } from "./update-password-deliveryman-use-case";
import { CreateDeliverymanUseCase } from "./create-deliveryman-use-case";
import { InMemoryDeliverymanRepository } from "../../../infraestructure/repositories/in-memory/in-memory-deliveryman-repository";
import { describe, expect, beforeEach, it } from "vitest";

let deliverymanRepository: InMemoryDeliverymanRepository;
let createDeliverymanUseCase: CreateDeliverymanUseCase;
let updatePasswordUseCase: UpdatePasswordDeliverymanUseCase;
let bcryptAdapter: BcryptAdapter;

describe("update password the deliveryman", () => {
  beforeEach(() => {
    deliverymanRepository = new InMemoryDeliverymanRepository();
    bcryptAdapter = new BcryptAdapter();
    updatePasswordUseCase = new UpdatePasswordDeliverymanUseCase(
      deliverymanRepository,
      bcryptAdapter
    );
    createDeliverymanUseCase = new CreateDeliverymanUseCase(deliverymanRepository, bcryptAdapter);
  });

  it("should be possible to update a deliveryman password by id", async () => {
    const deliverymanCreated = await createDeliverymanUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "123456",
      birthday_date: new Date("2003-12-11"),
    });

    if (deliverymanCreated.isFailure()) return;

    const id = deliverymanCreated.value.id;

    const deliveryman = await updatePasswordUseCase.execute({
      id,
      password: "102030",
    });

    expect(deliveryman.isSuccess()).toBe(true);
  });

  it("should be possible to update a deliveryman password if the deliveryman is not found", async () => {
    await createDeliverymanUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "123456",
      birthday_date: new Date("2003-12-11"),
    });

    const deliveryman = await updatePasswordUseCase.execute({ id: "1892371u89321mdkaodmq" });

    expect(deliveryman.isFailure()).toBe(true);
    expect(deliveryman.value).toBeInstanceOf(NotFoundError);
  });
});
