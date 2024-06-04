import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { NotFoundError } from "../errors/not-found-error";
import { CreatePixUseCase } from "../pix";
import { CreateUserUseCase } from "../user";
import { CreateCardUseCase } from "../card";
import { CreateOrderUseCase } from "./create-order-use-case";
import { InMemoryPixRepository } from "../../../infraestructure/repositories/in-memory/in-memory-pix-repository";
import { InMemoryUserRepository } from "../../../infraestructure/repositories/in-memory/in-memory-user-repository";
import { InMemoryCardRepository } from "../../../infraestructure/repositories/in-memory/in-memory-card-repository";
import { InMemoryOrderRepository } from "../../../infraestructure/repositories/in-memory/in-memory-order-repository";
import { describe, it, beforeEach, expect } from "vitest";

let orderRepository: InMemoryOrderRepository;
let userRepository: InMemoryUserRepository;
let pixRepository: InMemoryPixRepository;
let cardRepository: InMemoryCardRepository;
let createOrderUseCase: CreateOrderUseCase;
let createUserUseCase: CreateUserUseCase;
let createPixUseCase: CreatePixUseCase;
let createCardUseCase: CreateCardUseCase;
let bcryptAdapter: BcryptAdapter;

describe("create a new order", () => {
  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository();
    userRepository = new InMemoryUserRepository();
    pixRepository = new InMemoryPixRepository();
    cardRepository = new InMemoryCardRepository();
    bcryptAdapter = new BcryptAdapter();
    createUserUseCase = new CreateUserUseCase(userRepository, bcryptAdapter);
    createPixUseCase = new CreatePixUseCase(pixRepository, userRepository);
    createCardUseCase = new CreateCardUseCase(cardRepository, userRepository);
    createOrderUseCase = new CreateOrderUseCase(
      orderRepository,
      userRepository,
      pixRepository,
      cardRepository
    );
  });

  it("should be possible to create an order with pix", async () => {
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

    expect(order.isSuccess()).toBe(true);
  });

  it("should be possible to create an order with card", async () => {
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

    const order = await createOrderUseCase.execute({
      id_user,
      id_pix: null,
      id_card,
    });

    expect(order.isSuccess()).toBe(true);
  });

  it("should not be possible to create an order if pix is not found", async () => {
    const user = await createUserUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345",
    });

    if (user.isFailure()) return;

    const id_user = user.value.id;

    const order = await createOrderUseCase.execute({
      id_user,
      id_pix: "dauihduq8hduq8dhuq8",
      id_card: null,
    });

    expect(order.isFailure()).toBe(true);
    expect(order.value).toBeInstanceOf(NotFoundError);
  });

  it("should not be possible to create an order if card is not found", async () => {
    const user = await createUserUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345",
    });

    if (user.isFailure()) return;

    const id_user = user.value.id;

    const order = await createOrderUseCase.execute({
      id_user,
      id_pix: null,
      id_card: "da9uihduiadhquindiqudnmqin",
    });

    expect(order.isFailure()).toBe(true);
    expect(order.value).toBeInstanceOf(NotFoundError);
  });

  it("should not be possible to create an order if user is not found", async () => {
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

    const order = await createOrderUseCase.execute({
      id_user: "89du189damodamodia",
      id_pix: null,
      id_card,
    });

    expect(order.isFailure()).toBe(true);
    expect(order.value).toBeInstanceOf(NotFoundError);
  });

  it("should not be possible to create an order if card and pix are both referenced", async () => {
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

    const pix = await createPixUseCase.execute({ id_user });

    if (pix.isFailure()) return;
    if (card.isFailure()) return;

    const id_pix = pix.value.id;
    const id_card = card.value.id;

    await expect(async () => {
      await createOrderUseCase.execute({
        id_user,
        id_pix,
        id_card,
      });
    }).rejects.toThrowError("Escolha apenas uma forma de pagamento: pix ou cartão");
  });

  it("should not be possible to create an order if card and pix are null", async () => {
    const user = await createUserUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345",
    });

    if (user.isFailure()) return;

    const id_user = user.value.id;

    await expect(async () => {
      await createOrderUseCase.execute({
        id_user,
        id_pix: null,
        id_card: null,
      });
    }).rejects.toThrowError("Escolha alguma forma de pagamento: pix ou cartão");
  });
});
