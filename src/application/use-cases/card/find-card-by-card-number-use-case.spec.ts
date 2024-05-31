import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { CreateUserUseCase } from "../user/create-user-use-case";
import { CreateCardUseCase } from "./create-card-use-case";
import { InMemoryCardRepository } from "../../../infraestructure/repositories/in-memory/in-memory-card-repository";
import { InMemoryUserRepository } from "../../../infraestructure/repositories/in-memory/in-memory-user-repository";
import { FindCardByCardNumberUseCase } from "./find-card-by-card-number-use-case";
import { describe, it, beforeEach, expect } from "vitest";
import { NotFoundError } from "../errors/not-found-error";

let userRepository: InMemoryUserRepository;
let cardRepository: InMemoryCardRepository;
let createCardUseCase: CreateCardUseCase;
let createUserUseCase: CreateUserUseCase;
let findCardByCardNumberUseCase: FindCardByCardNumberUseCase;
let bcryptAdapter: BcryptAdapter;

describe("get card by card number", () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    cardRepository = new InMemoryCardRepository();
    bcryptAdapter = new BcryptAdapter();
    createCardUseCase = new CreateCardUseCase(cardRepository, userRepository);
    createUserUseCase = new CreateUserUseCase(userRepository, bcryptAdapter);
    findCardByCardNumberUseCase = new FindCardByCardNumberUseCase(cardRepository);
  });

  it("should be possible to get a card by card number", async () => {
    const user = await createUserUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "123456",
    });

    if (user.isFailure()) return;

    const id_user = user.value.id;

    const cardCreated = await createCardUseCase.execute({
      card_holder_name: "Matheus",
      card_number: "12345678910",
      expiration_date: new Date(),
      id_user,
    });

    if (cardCreated.isFailure()) return;

    const card_number = cardCreated.value.card_number;

    const card = await findCardByCardNumberUseCase.execute({ card_number });

    expect(card.isSuccess()).toBe(true);
  });

  it("should be possible to get a card by card number", async () => {
    const user = await createUserUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "123456",
    });

    if (user.isFailure()) return;

    const id_user = user.value.id;

    await createCardUseCase.execute({
      card_holder_name: "Matheus",
      card_number: "12345678910",
      expiration_date: new Date(),
      id_user,
    });

    const card = await findCardByCardNumberUseCase.execute({ card_number: 1020304050 });

    expect(card.isFailure()).toBe(true);
    expect(card.value).toBeInstanceOf(NotFoundError);
  });
});
