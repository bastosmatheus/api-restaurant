import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
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
import { FindDeliveriesByNotAcceptedUseCase } from "./find-deliveries-by-not-accepted-use-case";

let deliveryRepository: InMemoryDeliveryRepository;
let orderRepository: InMemoryOrderRepository;
let userRepository: InMemoryUserRepository;
let pixRepository: InMemoryPixRepository;
let cardRepository: InMemoryCardRepository;
let createOrderUseCase: CreateOrderUseCase;
let createUserUseCase: CreateUserUseCase;
let createPixUseCase: CreatePixUseCase;
let createDeliveryUseCase: CreateDeliveryUseCase;
let findDeliveriesByNotAcceptedUseCase: FindDeliveriesByNotAcceptedUseCase;
let bcryptAdapter: BcryptAdapter;

describe("get deliveries by deliveries not accepted", () => {
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
    findDeliveriesByNotAcceptedUseCase = new FindDeliveriesByNotAcceptedUseCase(deliveryRepository);
  });

  it("should be possible to get deliveries by deliveries not accepted", async () => {
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
    await createDeliveryUseCase.execute({ id_order });

    const deliveries = await findDeliveriesByNotAcceptedUseCase.execute();

    expect(deliveries.length).toBeGreaterThanOrEqual(2);
  });
});
