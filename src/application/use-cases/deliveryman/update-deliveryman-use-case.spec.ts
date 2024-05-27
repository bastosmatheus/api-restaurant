import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { NotFoundError } from "../errors/not-found-error";
import { CreateDeliverymanUseCase } from "./create-deliveryman-use-case";
import { UpdateDeliverymanUseCase } from "./update-deliveryman-use-case";
import { InMemoryDeliverymanRepository } from "../../../infraestructure/repositories/in-memory/in-memory-deliveryman-repository";
import { describe, it, expect, beforeEach } from "vitest";

let deliverymanRepository: InMemoryDeliverymanRepository;
let createDeliverymanUseCase: CreateDeliverymanUseCase;
let updateDeliverymanUseCase: UpdateDeliverymanUseCase;
let bcryptAdapter: BcryptAdapter;

describe("update a deliveryman", () => {
  beforeEach(() => {
    deliverymanRepository = new InMemoryDeliverymanRepository();
    bcryptAdapter = new BcryptAdapter();
    updateDeliverymanUseCase = new UpdateDeliverymanUseCase(deliverymanRepository);
    createDeliverymanUseCase = new CreateDeliverymanUseCase(deliverymanRepository, bcryptAdapter);
  });

  it("should be possible to update a deliveryman by id", async () => {
    const deliverymanCreated = await createDeliverymanUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "123456",
      birthday_date: new Date("2003-12-11"),
    });

    if (deliverymanCreated.isFailure()) return;

    const id = deliverymanCreated.value.id;

    const deliveryman = await updateDeliverymanUseCase.execute({ id, name: "Luanel Messi" });

    expect(deliveryman.isSuccess()).toBe(true);
  });

  it("should not be possible to update a deliveryman if the deliveryman is not found", async () => {
    await createDeliverymanUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "123456",
      birthday_date: new Date("2003-12-11"),
    });

    const deliveryman = await updateDeliverymanUseCase.execute({ id: "aisdh189e1dui9nadkladj819" });

    expect(deliveryman.isFailure()).toBe(true);
    expect(deliveryman.value).toBeInstanceOf(NotFoundError);
  });
});
