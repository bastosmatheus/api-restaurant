import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { CreateUserUseCase } from "../user";
import { CreateCardUseCase } from "../card";
import { CreateOrderUseCase } from "./create-order-use-case";
import { InMemoryPixRepository } from "../../../infraestructure/repositories/in-memory/in-memory-pix-repository";
import { InMemoryUserRepository } from "../../../infraestructure/repositories/in-memory/in-memory-user-repository";
import { InMemoryCardRepository } from "../../../infraestructure/repositories/in-memory/in-memory-card-repository";
import { InMemoryOrderRepository } from "../../../infraestructure/repositories/in-memory/in-memory-order-repository";
import { FindOrdersByCardsUseCase } from "./find-orders-by-cards-use-case";
import { describe, it, beforeEach, expect } from "vitest";

let orderRepository: InMemoryOrderRepository;
let userRepository: InMemoryUserRepository;
let pixRepository: InMemoryPixRepository;
let cardRepository: InMemoryCardRepository;
let createOrderUseCase: CreateOrderUseCase;
let createUserUseCase: CreateUserUseCase;
let createCardUseCase: CreateCardUseCase;
let findOrdersByCardsUseCase: FindOrdersByCardsUseCase;
let bcryptAdapter: BcryptAdapter;

describe("get orders by cards", () => {
  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository();
    userRepository = new InMemoryUserRepository();
    pixRepository = new InMemoryPixRepository();
    cardRepository = new InMemoryCardRepository();
    bcryptAdapter = new BcryptAdapter();
    createUserUseCase = new CreateUserUseCase(userRepository, bcryptAdapter);
    createCardUseCase = new CreateCardUseCase(cardRepository, userRepository);
    createOrderUseCase = new CreateOrderUseCase(
      orderRepository,
      userRepository,
      pixRepository,
      cardRepository
    );
    findOrdersByCardsUseCase = new FindOrdersByCardsUseCase(orderRepository);
  });

  it("should be possible to get orders by cards", async () => {
    const user = await createUserUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345",
    });

    if (user.isFailure()) return;

    const id_user = user.value.id;

    const card = await createCardUseCase.execute({
      card_holder_name: "Matheus",
      card_number: "12345678910",
      expiration_date: new Date("2025-03-06"),
      id_user,
    });

    if (card.isFailure()) return;

    const id_card = card.value.id;

    await createOrderUseCase.execute({
      id_user,
      id_pix: null,
      id_card,
    });

    await createOrderUseCase.execute({
      id_user,
      id_pix: null,
      id_card,
    });

    const orders = await findOrdersByCardsUseCase.execute();

    expect(orders.length).toBeGreaterThanOrEqual(2);
  });
});
