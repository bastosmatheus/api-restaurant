import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { NotFoundError } from "../errors/not-found-error";
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
let bcryptAdapter: BcryptAdapter;

describe("update delivery accepted", () => {
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
      deliverymanRepository,
      orderRepository
    );
  });

  it("should be possible to update a prop delivery accepted and id deliveryman", async () => {
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

    const delivery = await deliveryAcceptedUseCase.execute({ id, id_deliveryman });

    expect(delivery.isSuccess()).toBe(true);
  });

  it("should not be possible to update a prop delivery accepted if the delivery is not found", async () => {
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

    const deliveryman = await createDeliverymanUseCase.execute({
      name: "Matheus 2",
      email: "matheus@gmail.com",
      password: "102030",
      birthday_date: new Date("2002-09-10"),
    });

    if (deliveryman.isFailure()) return;

    const id_deliveryman = deliveryman.value.id;

    const delivery = await deliveryAcceptedUseCase.execute({
      id: "3891y89e1jd9ma kldmi1mdoq",
      id_deliveryman,
    });

    expect(delivery.isFailure()).toBe(true);
    expect(delivery.value).toBeInstanceOf(NotFoundError);
  });

  it("should not be possible to update a prop delivery accepted if the deliveryman is not found", async () => {
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

    const delivery = await deliveryAcceptedUseCase.execute({
      id,
      id_deliveryman: "1893yu189eu9djmwoiakmdoi1jue81",
    });

    expect(delivery.isFailure()).toBe(true);
    expect(delivery.value).toBeInstanceOf(NotFoundError);
  });
});
