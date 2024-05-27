import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { NotFoundError } from "../errors/not-found-error";
import { CreateDeliverymanUseCase } from "./create-deliveryman-use-case";
import { FindDeliverymanByIdUseCase } from "./find-deliveryman-by-id-use-case";
import { InMemoryDeliverymanRepository } from "../../../infraestructure/repositories/in-memory/in-memory-deliveryman-repository";
import { describe, expect, beforeEach, it } from "vitest";

let deliverymanRepository: InMemoryDeliverymanRepository;
let createDeliverymanUseCase: CreateDeliverymanUseCase;
let findDeliverymanByIdUseCase: FindDeliverymanByIdUseCase;
let bcryptAdapter: BcryptAdapter;

describe("get deliveryman by id", () => {
  beforeEach(() => {
    deliverymanRepository = new InMemoryDeliverymanRepository();
    bcryptAdapter = new BcryptAdapter();
    findDeliverymanByIdUseCase = new FindDeliverymanByIdUseCase(deliverymanRepository);
    createDeliverymanUseCase = new CreateDeliverymanUseCase(deliverymanRepository, bcryptAdapter);
  });

  it("should be possible to get a deliveryman by id", async () => {
    const deliverymanCreated = await createDeliverymanUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "123456",
      birthday_date: new Date("2003-12-11"),
    });

    if (deliverymanCreated.isFailure()) return;

    const id = deliverymanCreated.value.id;

    const deliveryman = await findDeliverymanByIdUseCase.execute({ id });

    expect(deliveryman.isSuccess()).toBe(true);
  });

  it("should not be possible to get a deliveryman if the deliveryman is not found", async () => {
    await createDeliverymanUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "123456",
      birthday_date: new Date("2003-12-11"),
    });

    const deliveryman = await findDeliverymanByIdUseCase.execute({
      id: "di9u198dk-0qkd981782ed90qmdoq9027843-amiod",
    });

    expect(deliveryman.isFailure()).toBe(true);
    expect(deliveryman.value).toBeInstanceOf(NotFoundError);
  });
});
