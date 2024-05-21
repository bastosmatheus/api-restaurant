import { CreateFoodUseCase } from "./create-food-use-case";
import { InMemoryFoodRepository } from "../../../infraestructure/repositories/in-memory/in-memory-food-repository";
import { FindFoodsByCategoryUseCase } from "./find-foods-by-category-use-case";
import { describe, it, beforeEach, expect } from "vitest";

let foodRepository: InMemoryFoodRepository;
let createFoodUseCase: CreateFoodUseCase;
let findFoodsByCategoryUseCase: FindFoodsByCategoryUseCase;

describe("get foods by category", () => {
  beforeEach(() => {
    foodRepository = new InMemoryFoodRepository();
    createFoodUseCase = new CreateFoodUseCase(foodRepository);
    findFoodsByCategoryUseCase = new FindFoodsByCategoryUseCase(foodRepository);
  });

  it("should be possible to get foods by category", async () => {
    await createFoodUseCase.execute({
      food_name: "Macarrão",
      price: 21.99,
      description: "Macarrão ao molho branco com um sabor delicioso",
      category: "Comida",
      image: "https://img.freepik.com/fotos-gratis/tela-vazia-branca_1194-7555.jpg",
    });

    await createFoodUseCase.execute({
      food_name: "Baião de II",
      price: 34.99,
      description:
        "Baião de dois é um prato tipico da região Nordeste. Consiste num preparado de arroz e feijão.",
      category: "Comida",
      image: "https://img.freepik.com/fotos-gratis/tela-vazia-branca_1194-7555.jpg",
    });

    const foods = await findFoodsByCategoryUseCase.execute({ category: "Comida" });

    expect(foods.length).toBeGreaterThanOrEqual(2);
  });
});
