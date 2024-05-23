import { ConflictError } from "../errors/conflict-error";
import { CreateFoodUseCase } from "./create-food-use-case";
import { InMemoryFoodRepository } from "../../../infraestructure/repositories/in-memory/in-memory-food-repository";
import { describe, it, beforeEach, expect } from "vitest";

let foodRepository: InMemoryFoodRepository;
let createFoodUseCase: CreateFoodUseCase;

describe("create a new food", () => {
  beforeEach(() => {
    foodRepository = new InMemoryFoodRepository();
    createFoodUseCase = new CreateFoodUseCase(foodRepository);
  });

  it("should be possible to create a food", async () => {
    const food = await createFoodUseCase.execute({
      food_name: "Macarrão",
      price: 21.99,
      description: "Macarrão ao molho branco com um sabor delicioso",
      category: "Comida",
      image: "https://img.freepik.com/fotos-gratis/tela-vazia-branca_1194-7555.jpg",
    });

    expect(food.isSuccess()).toBe(true);
  });

  it("should not be possible to create a food if the name already exists", async () => {
    await createFoodUseCase.execute({
      food_name: "Macarrão",
      price: 21.99,
      description: "Macarrão ao molho branco com um sabor delicioso",
      category: "Comida",
      image: "https://img.freepik.com/fotos-gratis/tela-vazia-branca_1194-7555.jpg",
    });

    const food = await createFoodUseCase.execute({
      food_name: "Macarrão",
      price: 21.99,
      description: "Macarrão ao molho branco com um sabor delicioso",
      category: "Comida",
      image: "https://img.freepik.com/fotos-gratis/tela-vazia-branca_1194-7555.jpg",
    });

    expect(food.isFailure()).toBe(true);
    expect(food.value).toBeInstanceOf(ConflictError);
  });
});
