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
import { FindDeliveriesByDeliverymanUseCase } from "./find-deliveries-by-deliveryman-use-case";
import { CreateDeliverymanUseCase } from "../deliveryman";
import { InMemoryDeliverymanRepository } from "../../../infraestructure/repositories/in-memory/in-memory-deliveryman-repository";
import { DeliveryAcceptedUseCase } from "./delivery-accepted-use-case";

let deliveryRepository: InMemoryDeliveryRepository;
let deliverymanRepository: InMemoryDeliverymanRepository;
let orderRepository: InMemoryOrderRepository;
let userRepository: InMemoryUserRepository;
let pixRepository: InMemoryPixRepository;
let cardRepository: InMemoryCardRepository;
let createOrderUseCase: CreateOrderUseCase;
let createUserUseCase: CreateUserUseCase;
let createPixUseCase: CreatePixUseCase;
let createDeliveryUseCase: CreateDeliveryUseCase;
let createDeliverymanUseCase: CreateDeliverymanUseCase;
let deliveryAcceptedUseCase: DeliveryAcceptedUseCase;
let findDeliveriesByDeliverymanUseCase: FindDeliveriesByDeliverymanUseCase;
let bcryptAdapter: BcryptAdapter;

describe("get deliveries by deliveryman", () => {
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
    createOrderUseCase = new CreateOrderUseCase(
      orderRepository,
      userRepository,
      pixRepository,
      cardRepository
    );
    createDeliverymanUseCase = new CreateDeliverymanUseCase(deliverymanRepository, bcryptAdapter);
    createDeliveryUseCase = new CreateDeliveryUseCase(deliveryRepository, orderRepository);
    deliveryAcceptedUseCase = new DeliveryAcceptedUseCase(
      deliveryRepository,
      deliverymanRepository,
      orderRepository
    );
    findDeliveriesByDeliverymanUseCase = new FindDeliveriesByDeliverymanUseCase(deliveryRepository);
  });

  it("should be possible to get deliveries by deliveryman", async () => {
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

    const deliveryman = await createDeliverymanUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "123456",
      birthday_date: new Date("2003-12-11"),
    });

    if (deliveryman.isFailure()) return;

    const id_deliveryman = deliveryman.value.id;

    const deliveryCreated = await createDeliveryUseCase.execute({ id_order });

    if (deliveryCreated.isFailure()) return;

    const id = deliveryCreated.value.id;

    await deliveryAcceptedUseCase.execute({ id, id_deliveryman });

    const deliveries = await findDeliveriesByDeliverymanUseCase.execute({ id_deliveryman });

    expect(deliveries.length).toBeGreaterThanOrEqual(1);
  });
});
