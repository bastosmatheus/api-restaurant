import { NotFoundError } from "../errors/not-found-error";
import { CreateFoodUseCase } from "./create-food-use-case";
import { FindFoodByNameUseCase } from "./find-food-by-name-use-case";
import { InMemoryFoodRepository } from "../../../infraestructure/repositories/in-memory/in-memory-food-repository";
import { describe, it, beforeEach, expect } from "vitest";

let foodRepository: InMemoryFoodRepository;
let createFoodUseCase: CreateFoodUseCase;
let findFoodByNameUseCase: FindFoodByNameUseCase;

describe("get food by name", () => {
  beforeEach(() => {
    foodRepository = new InMemoryFoodRepository();
    createFoodUseCase = new CreateFoodUseCase(foodRepository);
    findFoodByNameUseCase = new FindFoodByNameUseCase(foodRepository);
  });

  it("should be possible to get a food by name", async () => {
    await createFoodUseCase.execute({
      food_name: "Macarrão",
      price: 21.99,
      description: "Macarrão ao molho branco com um sabor delicioso",
      category: "Comida",
      image: "https://img.freepik.com/fotos-gratis/tela-vazia-branca_1194-7555.jpg",
    });

    const food = await findFoodByNameUseCase.execute({ food_name: "Macarrão" });

    expect(food.isSuccess()).toBe(true);
  });

  it("should not be possible to get a food if the name does not exist", async () => {
    await createFoodUseCase.execute({
      food_name: "Macarrão",
      price: 21.99,
      description: "Macarrão ao molho branco com um sabor delicioso",
      category: "Comida",
      image: "https://img.freepik.com/fotos-gratis/tela-vazia-branca_1194-7555.jpg",
    });

    const food = await findFoodByNameUseCase.execute({ food_name: "Picanha" });

    expect(food.isFailure()).toBe(true);
    expect(food.value).toBeInstanceOf(NotFoundError);
  });
});
