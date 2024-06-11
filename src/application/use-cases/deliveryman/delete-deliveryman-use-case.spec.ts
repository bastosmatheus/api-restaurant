import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { NotFoundError } from "../errors/not-found-error";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { CreateDeliverymanUseCase } from "./create-deliveryman-use-case";
import { DeleteDeliverymanUseCase } from "./delete-deliveryman-use-case";
import { InMemoryDeliverymanRepository } from "../../../infraestructure/repositories/in-memory/in-memory-deliveryman-repository";
import { describe, expect, beforeEach, it } from "vitest";

let deliverymanRepository: InMemoryDeliverymanRepository;
let createDeliverymanUseCase: CreateDeliverymanUseCase;
let deleteDeliverymanUseCase: DeleteDeliverymanUseCase;
let bcryptAdapter: BcryptAdapter;

describe("delete a deliveryman by id", () => {
  beforeEach(() => {
    deliverymanRepository = new InMemoryDeliverymanRepository();
    bcryptAdapter = new BcryptAdapter();
    deleteDeliverymanUseCase = new DeleteDeliverymanUseCase(deliverymanRepository);
    createDeliverymanUseCase = new CreateDeliverymanUseCase(deliverymanRepository, bcryptAdapter);
  });

  it("should be possible to delete a deliveryman by id", async () => {
    const deliverymanCreated = await createDeliverymanUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "123456",
      birthday_date: new Date("2003-12-11"),
    });

    if (deliverymanCreated.isFailure()) return;

    const id = deliverymanCreated.value.id;

    const deliveryman = await deleteDeliverymanUseCase.execute({ id, id_deliveryman: id });

    expect(deliveryman.isSuccess()).toBe(true);
  });

  it("should not be possible to delete a deliveryman if the id_deliveryman is different the id", async () => {
    const deliverymanCreated = await createDeliverymanUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "123456",
      birthday_date: new Date("2003-12-11"),
    });

    if (deliverymanCreated.isFailure()) return;

    const id = deliverymanCreated.value.id;

    const deliveryman = await deleteDeliverymanUseCase.execute({
      id,
      id_deliveryman: "doaijdui1qjd9kqidunqhnu",
    });

    expect(deliveryman.isFailure()).toBe(true);
    expect(deliveryman.value).toBeInstanceOf(UnauthorizedError);
  });

  it("should not be possible to delete a deliveryman if the deliveryman is not found", async () => {
    await createDeliverymanUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "123456",
      birthday_date: new Date("2003-12-11"),
    });

    const deliveryman = await deleteDeliverymanUseCase.execute({
      id: "di9u198dk-0qkd981782ed90qmdoq9027843-amiod",
    });

    expect(deliveryman.isFailure()).toBe(true);
    expect(deliveryman.value).toBeInstanceOf(NotFoundError);
  });
});
