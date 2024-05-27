import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { CreateDeliverymanUseCase } from "./create-deliveryman-use-case";
import { FindAllDeliverymansUseCase } from "./find-all-deliverymans-use-case";
import { InMemoryDeliverymanRepository } from "../../../infraestructure/repositories/in-memory/in-memory-deliveryman-repository";
import { describe, expect, beforeEach, it } from "vitest";

let deliverymanRepository: InMemoryDeliverymanRepository;
let createDeliverymanUseCase: CreateDeliverymanUseCase;
let findAllDeliverymansUseCase: FindAllDeliverymansUseCase;
let bcryptAdapter: BcryptAdapter;

describe("get all deliverymans", () => {
  beforeEach(() => {
    deliverymanRepository = new InMemoryDeliverymanRepository();
    bcryptAdapter = new BcryptAdapter();
    createDeliverymanUseCase = new CreateDeliverymanUseCase(deliverymanRepository, bcryptAdapter);
    findAllDeliverymansUseCase = new FindAllDeliverymansUseCase(deliverymanRepository);
  });

  it("should be possible to get all deliverymans", async () => {
    await createDeliverymanUseCase.execute({
      name: "Matheus 1",
      email: "matheus1@gmail.com",
      password: "123456",
      birthday_date: new Date("2003-12-11"),
    });

    await createDeliverymanUseCase.execute({
      name: "Matheus 2",
      email: "matheus2@gmail.com",
      password: "102030",
      birthday_date: new Date("2002-09-10"),
    });

    const deliverymans = await findAllDeliverymansUseCase.execute();

    expect(deliverymans.length).toBeGreaterThanOrEqual(2);
  });
});
