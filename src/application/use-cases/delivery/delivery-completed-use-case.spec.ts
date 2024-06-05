import { NotFoundError } from "../errors/not-found-error";
import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { CreatePixUseCase } from "../pix";
import { CreateUserUseCase } from "../user";
import { CreateOrderUseCase } from "../order/create-order-use-case";
import { InMemoryPixRepository } from "../../../infraestructure/repositories/in-memory/in-memory-pix-repository";
import { CreateDeliveryUseCase } from "./create-delivery-use-case";
import { InMemoryUserRepository } from "../../../infraestructure/repositories/in-memory/in-memory-user-repository";
import { InMemoryCardRepository } from "../../../infraestructure/repositories/in-memory/in-memory-card-repository";
import { InMemoryOrderRepository } from "../../../infraestructure/repositories/in-memory/in-memory-order-repository";
import { DeliveryAcceptedUseCase } from "./delivery-accepted-use-case";
import { CreateDeliverymanUseCase } from "../deliveryman";
import { DeliveryCompletedUseCase } from "./delivery-completed-use-case";
import { InMemoryDeliveryRepository } from "../../../infraestructure/repositories/in-memory/in-memory-delivery-repository";
import { InMemoryDeliverymanRepository } from "../../../infraestructure/repositories/in-memory/in-memory-deliveryman-repository";
import { describe, it, beforeEach, expect } from "vitest";

let deliveryRepository: InMemoryDeliveryRepository;
let orderRepository: InMemoryOrderRepository;
let userRepository: InMemoryUserRepository;
let pixRepository: InMemoryPixRepository;
let cardRepository: InMemoryCardRepository;
let deliverymanRepository: InMemoryDeliverymanRepository;
let createOrderUseCase: CreateOrderUseCase;
let createUserUseCase: CreateUserUseCase;
let createPixUseCase: CreatePixUseCase;
let createDeliveryUseCase: CreateDeliveryUseCase;
let createDeliverymanUseCase: CreateDeliverymanUseCase;
let deliveryAcceptedUseCase: DeliveryAcceptedUseCase;
let deliveryCompletedUseCase: DeliveryCompletedUseCase;
let bcryptAdapter: BcryptAdapter;

describe("update delivery completed", () => {
  beforeEach(() => {
    deliveryRepository = new InMemoryDeliveryRepository();
    deliverymanRepository = new InMemoryDeliverymanRepository();
    orderRepository = new InMemoryOrderRepository();
    userRepository = new InMemoryUserRepository();
    pixRepository = new InMemoryPixRepository();
    cardRepository = new InMemoryCardRepository();
    bcryptAdapter = new BcryptAdapter();
    createUserUseCase = new CreateUserUseCase(userRepository, bcryptAdapter);
    createPixUseCase = new CreatePixUseCase(pixRepository, userRepository);
    createDeliverymanUseCase = new CreateDeliverymanUseCase(deliverymanRepository, bcryptAdapter);
    createOrderUseCase = new CreateOrderUseCase(
      orderRepository,
      userRepository,
      pixRepository,
      cardRepository
    );
    createDeliveryUseCase = new CreateDeliveryUseCase(deliveryRepository, orderRepository);
    deliveryAcceptedUseCase = new DeliveryAcceptedUseCase(
      deliveryRepository,
      deliverymanRepository
    );
    deliveryCompletedUseCase = new DeliveryCompletedUseCase(deliveryRepository);
  });

  it("should be possible to update a prop delivery completed", async () => {
    const user = await createUserUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345",
    });

    if (user.isFailure()) return;

    const id_user = user.value.id;

    const pix = await createPixUseCase.execute({ id_user });

    if (pix.isFailure()) return;

    const id_pix = pix.value.id;

    const order = await createOrderUseCase.execute({
      id_user,
      id_pix,
      id_card: null,
    });

    if (order.isFailure()) return;

    const id_order = order.value.id;

    const deliveryCreated = await createDeliveryUseCase.execute({ id_order });

    if (deliveryCreated.isFailure()) return;

    const id = deliveryCreated.value.id;

    const deliveryman = await createDeliverymanUseCase.execute({
      name: "Matheus 2",
      email: "matheus@gmail.com",
      password: "102030",
      birthday_date: new Date("2002-09-10"),
    });

    if (deliveryman.isFailure()) return;

    const id_deliveryman = deliveryman.value.id;

    await deliveryAcceptedUseCase.execute({ id, id_deliveryman });

    const delivery = await deliveryCompletedUseCase.execute({ id });

    expect(delivery.isSuccess()).toBe(true);
  });

  it("should not be possible to update a prop delivery completed if the delivery is not found", async () => {
    const user = await createUserUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345",
    });

    if (user.isFailure()) return;

    const id_user = user.value.id;

    const pix = await createPixUseCase.execute({ id_user });

    if (pix.isFailure()) return;

    const id_pix = pix.value.id;

    await createOrderUseCase.execute({
      id_user,
      id_pix,
      id_card: null,
    });

    const delivery = await deliveryCompletedUseCase.execute({ id: "diuajhduiadjuiadjaiud" });

    expect(delivery.isFailure()).toBe(true);
    expect(delivery.value).toBeInstanceOf(NotFoundError);
  });

  it("should not be possible to update a prop delivery completed if the delivery is not accepted", async () => {
    const user = await createUserUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345",
    });

    if (user.isFailure()) return;

    const id_user = user.value.id;

    const pix = await createPixUseCase.execute({ id_user });

    if (pix.isFailure()) return;

    const id_pix = pix.value.id;

    const order = await createOrderUseCase.execute({
      id_user,
      id_pix,
      id_card: null,
    });

    if (order.isFailure()) return;

    const id_order = order.value.id;

    const deliveryCreated = await createDeliveryUseCase.execute({ id_order });

    if (deliveryCreated.isFailure()) return;

    const id = deliveryCreated.value.id;

    await expect(async () => {
      await deliveryCompletedUseCase.execute({ id });
    }).rejects.toThrowError("Não é possivel completar a entrega, primeiro deve aceita-la");
  });
});
