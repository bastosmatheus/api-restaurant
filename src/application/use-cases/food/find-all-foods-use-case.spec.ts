import { CreateFoodUseCase } from "./create-food-use-case";
import { FindAllFoodsUseCase } from "./find-all-foods-use-case";
import { InMemoryFoodRepository } from "../../../infraestructure/repositories/in-memory/in-memory-food-repository";
import { describe, it, beforeEach, expect } from "vitest";

let foodRepository: InMemoryFoodRepository;
let createFoodUseCase: CreateFoodUseCase;
let findAllFoodsUseCase: FindAllFoodsUseCase;

describe("get all foods", () => {
  beforeEach(() => {
    foodRepository = new InMemoryFoodRepository();
    createFoodUseCase = new CreateFoodUseCase(foodRepository);
    findAllFoodsUseCase = new FindAllFoodsUseCase(foodRepository);
  });

  it("should be possible to get all foods", async () => {
    await createFoodUseCase.execute({
      food_name: "Macarrão",
      price: 21.99,
      description: "Macarrão ao molho branco com um sabor delicioso",
      category: "Comida",
      image: "https://img.freepik.com/fotos-gratis/tela-vazia-branca_1194-7555.jpg",
    });

    await createFoodUseCase.execute({
      food_name: "Coca Cola 2l",
      price: 12.0,
      description: "Refrigerante coca cola",
      category: "Bebida",
      image: "https://img.freepik.com/fotos-gratis/tela-vazia-branca_1194-7555.jpg",
    });

    const foods = await findAllFoodsUseCase.execute();

    expect(foods.length).toBeGreaterThanOrEqual(2);
  });
});
