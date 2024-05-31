import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryUserRepository } from "../../../infraestructure/repositories/in-memory/in-memory-user-repository";
import { InMemoryCardRepository } from "../../../infraestructure/repositories/in-memory/in-memory-card-repository";
import { CreateCardUseCase } from "./create-card-use-case";
import { CreateUserUseCase } from "../user/create-user-use-case";
import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { DeleteCardUseCase } from "./delete-card-use-case";
import { NotFoundError } from "../errors/not-found-error";

let userRepository: InMemoryUserRepository;
let cardRepository: InMemoryCardRepository;
let createCardUseCase: CreateCardUseCase;
let createUserUseCase: CreateUserUseCase;
let deleteCardUseCase: DeleteCardUseCase;
let bcryptAdapter: BcryptAdapter;

describe("delete a card by id", () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    cardRepository = new InMemoryCardRepository();
    bcryptAdapter = new BcryptAdapter();
    createCardUseCase = new CreateCardUseCase(cardRepository, userRepository);
    createUserUseCase = new CreateUserUseCase(userRepository, bcryptAdapter);
    deleteCardUseCase = new DeleteCardUseCase(cardRepository);
  });

  it("should be possible to delete a card by id", async () => {
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

    const id = cardCreated.value.id;

    const card = await deleteCardUseCase.execute({ id });

    expect(card.isSuccess()).toBe(true);
  });

  it("should not be possible to delete a card if the card is not found", async () => {
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

    const card = await deleteCardUseCase.execute({ id: "18929d9wimioqwdmoi18791dmok" });

    expect(card.isFailure()).toBe(true);
    expect(card.value).toBeInstanceOf(NotFoundError);
  });
});
