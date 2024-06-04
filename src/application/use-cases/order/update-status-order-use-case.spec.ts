import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { NotFoundError } from "../errors/not-found-error";
import { CreatePixUseCase } from "../pix";
import { CreateUserUseCase } from "../user";
import { CreateOrderUseCase } from "./create-order-use-case";
import { InMemoryPixRepository } from "../../../infraestructure/repositories/in-memory/in-memory-pix-repository";
import { InMemoryUserRepository } from "../../../infraestructure/repositories/in-memory/in-memory-user-repository";
import { InMemoryCardRepository } from "../../../infraestructure/repositories/in-memory/in-memory-card-repository";
import { InMemoryOrderRepository } from "../../../infraestructure/repositories/in-memory/in-memory-order-repository";
import { UpdateStatusOrderUseCase } from "./update-status-order-use-case";
import { describe, it, beforeEach, expect } from "vitest";

let orderRepository: InMemoryOrderRepository;
let userRepository: InMemoryUserRepository;
let pixRepository: InMemoryPixRepository;
let cardRepository: InMemoryCardRepository;
let createOrderUseCase: CreateOrderUseCase;
let createUserUseCase: CreateUserUseCase;
let createPixUseCase: CreatePixUseCase;
let updateStatusOrderUseCase: UpdateStatusOrderUseCase;
let bcryptAdapter: BcryptAdapter;

describe("update an order status", () => {
  beforeEach(() => {
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
    updateStatusOrderUseCase = new UpdateStatusOrderUseCase(orderRepository);
  });

  it("should be possible to update an order status", async () => {
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

    const orderCreated = await createOrderUseCase.execute({
      id_user,
      id_pix,
      id_card: null,
    });

    if (orderCreated.isFailure()) return;

    const id = orderCreated.value.id;

    const order = await updateStatusOrderUseCase.execute({ id, status: "Pagamento confirmado" });

    expect(order.isSuccess()).toBe(true);
  });

  it("should not be possible to update an order status if order is not found", async () => {
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

    const order = await updateStatusOrderUseCase.execute({
      id: "da89h1879jd980 1kdmn1iumi9dajdaj",
    });

    expect(order.isFailure()).toBe(true);
    expect(order.value).toBeInstanceOf(NotFoundError);
  });
});
