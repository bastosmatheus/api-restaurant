import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { CreateUserUseCase } from "../user/create-user-use-case";
import { CreateCardUseCase } from "./create-card-use-case";
import { FindAllCardsUseCase } from "./find-all-cards-use-case";
import { InMemoryCardRepository } from "../../../infraestructure/repositories/in-memory/in-memory-card-repository";
import { InMemoryUserRepository } from "../../../infraestructure/repositories/in-memory/in-memory-user-repository";
import { describe, it, beforeEach, expect } from "vitest";

let userRepository: InMemoryUserRepository;
let cardRepository: InMemoryCardRepository;
let createCardUseCase: CreateCardUseCase;
let createUserUseCase: CreateUserUseCase;
let findAllCardsUseCase: FindAllCardsUseCase;
let bcryptAdapter: BcryptAdapter;

describe("get all cards", () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    cardRepository = new InMemoryCardRepository();
    bcryptAdapter = new BcryptAdapter();
    createCardUseCase = new CreateCardUseCase(cardRepository, userRepository);
    createUserUseCase = new CreateUserUseCase(userRepository, bcryptAdapter);
    findAllCardsUseCase = new FindAllCardsUseCase(cardRepository);
  });

  it("should be possible to get all cards", async () => {
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
      expiration_date: new Date("2025-03-06"),
      id_user,
    });

    await createCardUseCase.execute({
      card_holder_name: "Lucas",
      card_number: "12345678911",
      expiration_date: new Date("2025-03-06"),
      id_user,
    });

    const cards = await findAllCardsUseCase.execute();

    expect(cards.length).toBeGreaterThanOrEqual(2);
  });
});
