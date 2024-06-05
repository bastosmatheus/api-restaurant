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
import { InMemoryDeliveryRepository } from "../../../infraestructure/repositories/in-memory/in-memory-delivery-repository";
import { describe, it, beforeEach, expect } from "vitest";
import { FindDeliveryByIdUseCase } from "./find-delivery-by-id-use-case";

let deliveryRepository: InMemoryDeliveryRepository;
let orderRepository: InMemoryOrderRepository;
let userRepository: InMemoryUserRepository;
let pixRepository: InMemoryPixRepository;
let cardRepository: InMemoryCardRepository;
let createOrderUseCase: CreateOrderUseCase;
let createUserUseCase: CreateUserUseCase;
let createPixUseCase: CreatePixUseCase;
let createDeliveryUseCase: CreateDeliveryUseCase;
let findDeliveryByIdUseCase: FindDeliveryByIdUseCase;
let bcryptAdapter: BcryptAdapter;

describe("get delivery by id", () => {
  beforeEach(() => {
    deliveryRepository = new InMemoryDeliveryRepository();
    orderRepository = new InMemoryOrderRepository();
    userRepository = new InMemoryUserRepository();
    pixRepository = new InMemoryPixRepository();
    cardRepository = new InMemoryCardRepository();
    bcryptAdapter = new BcryptAdapter();
    createUserUseCase = new CreateUserUseCase(userRepository, bcryptAdapter);
    createPixUseCase = new CreatePixUseCase(pixRepository, userRepository);
    createOrderUseCase = new CreateOrderUseCase(
      orderRepository,
      userRepository,
      pixRepository,
      cardRepository
    );
    createDeliveryUseCase = new CreateDeliveryUseCase(deliveryRepository, orderRepository);
    findDeliveryByIdUseCase = new FindDeliveryByIdUseCase(deliveryRepository);
  });

  it("should be possible to get a delivery by id", async () => {
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

    const delivery = await findDeliveryByIdUseCase.execute({ id });

    expect(delivery.isSuccess()).toBe(true);
  });

  it("should not be possible to get a delivery if the delivery is not found", async () => {
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

    await createDeliveryUseCase.execute({ id_order });

    const delivery = await findDeliveryByIdUseCase.execute({ id: "daiudhju8qdu8niudnq" });

    expect(delivery.isFailure()).toBe(true);
    expect(delivery.value).toBeInstanceOf(NotFoundError);
  });
});
