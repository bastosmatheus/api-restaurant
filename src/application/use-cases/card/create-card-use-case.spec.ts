import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { NotFoundError } from "../errors/not-found-error";
import { ConflictError } from "../errors/conflict-error";
import { CreateCardUseCase } from "./create-card-use-case";
import { CreateUserUseCase } from "../user/create-user-use-case";
import { InMemoryUserRepository } from "../../../infraestructure/repositories/in-memory/in-memory-user-repository";
import { InMemoryCardRepository } from "../../../infraestructure/repositories/in-memory/in-memory-card-repository";
import { describe, it, expect, beforeEach } from "vitest";

let userRepository: InMemoryUserRepository;
let cardRepository: InMemoryCardRepository;
let createCardUseCase: CreateCardUseCase;
let createUserUseCase: CreateUserUseCase;
let bcryptAdapter: BcryptAdapter;

describe("create a new card", () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    cardRepository = new InMemoryCardRepository();
    bcryptAdapter = new BcryptAdapter();
    createCardUseCase = new CreateCardUseCase(cardRepository, userRepository);
    createUserUseCase = new CreateUserUseCase(userRepository, bcryptAdapter);
  });

  it("should be possible to create a card", async () => {
    const user = await createUserUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "123456",
    });

    if (user.isFailure()) return;

    const id_user = user.value.id;

    const card = await createCardUseCase.execute({
      card_holder_name: "Matheus",
      card_number: "12345678910",
      expiration_date: new Date("2025-03-06"),
      id_user,
    });

    expect(card.isSuccess()).toBe(true);
  });

  it("should not be possible to create a card if the user is not found", async () => {
    await createUserUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "123456",
    });

    const card = await createCardUseCase.execute({
      card_holder_name: "Matheus",
      card_number: "12345678910",
      expiration_date: new Date("2025-03-06"),
      id_user: "diuajdioqopdqiodjqniduqn",
    });

    expect(card.isFailure()).toBe(true);
    expect(card.value).toBeInstanceOf(NotFoundError);
  });

  it("should not be possible to create a card if the card number already exists", async () => {
    const user = await createUserUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "123456",
    });

    if (user.isFailure()) return;

    const id_user = user.value.id;

    await createCardUseCase.execute({
      card_holder_name: "Lucas",
      card_number: "12345678910",
      expiration_date: new Date("2025-03-06"),
      id_user,
    });

    const card = await createCardUseCase.execute({
      card_holder_name: "Matheus",
      card_number: "12345678910",
      expiration_date: new Date("2025-03-06"),
      id_user,
    });

    expect(card.isFailure()).toBe(true);
    expect(card.value).toBeInstanceOf(ConflictError);
  });

  it("should not be possible to create a card if the card is expired", async () => {
    const user = await createUserUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "123456",
    });

    if (user.isFailure()) return;

    const id_user = user.value.id;

    await expect(async () => {
      await createCardUseCase.execute({
        card_holder_name: "Lucas",
        card_number: "12345678910",
        expiration_date: new Date("2020-03-06"),
        id_user,
      });
    }).rejects.toThrowError("O cartão está expirado");
  });
});
