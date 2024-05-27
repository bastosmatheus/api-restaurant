import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { NotFoundError } from "../errors/not-found-error";
import { CreateDeliverymanUseCase } from "./create-deliveryman-use-case";
import { FindDeliverymanByEmailUseCase } from "./find-deliveryman-by-email-use-case";
import { InMemoryDeliverymanRepository } from "../../../infraestructure/repositories/in-memory/in-memory-deliveryman-repository";
import { describe, expect, beforeEach, it } from "vitest";

let deliverymanRepository: InMemoryDeliverymanRepository;
let createDeliverymanUseCase: CreateDeliverymanUseCase;
let findDeliverymanByEmailUseCase: FindDeliverymanByEmailUseCase;
let bcryptAdapter: BcryptAdapter;

describe("get deliveryman by email", () => {
  beforeEach(() => {
    deliverymanRepository = new InMemoryDeliverymanRepository();
    bcryptAdapter = new BcryptAdapter();
    findDeliverymanByEmailUseCase = new FindDeliverymanByEmailUseCase(deliverymanRepository);
    createDeliverymanUseCase = new CreateDeliverymanUseCase(deliverymanRepository, bcryptAdapter);
  });

  it("should be possible to get a deliveryman by email", async () => {
    const deliverymanCreated = await createDeliverymanUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "123456",
      birthday_date: new Date("2003-12-11"),
    });

    if (deliverymanCreated.isFailure()) return;

    const email = deliverymanCreated.value.email;

    const deliveryman = await findDeliverymanByEmailUseCase.execute({ email });

    expect(deliveryman.isSuccess()).toBe(true);
  });

  it("should not be possible to get a deliveryman if the deliveryman is not found", async () => {
    await createDeliverymanUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "123456",
      birthday_date: new Date("2003-12-11"),
    });

    const deliveryman = await findDeliverymanByEmailUseCase.execute({
      email: "emailerrado@gmail.com",
    });

    expect(deliveryman.isFailure()).toBe(true);
    expect(deliveryman.value).toBeInstanceOf(NotFoundError);
  });
});
