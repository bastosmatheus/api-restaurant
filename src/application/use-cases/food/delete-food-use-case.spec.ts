import { NotFoundError } from "../errors/not-found-error";
import { CreateFoodUseCase } from "./create-food-use-case";
import { DeleteFoodUseCase } from "./delete-food-use-case";
import { InMemoryFoodRepository } from "../../../infraestructure/repositories/in-memory/in-memory-food-repository";
import { describe, it, beforeEach, expect } from "vitest";

let foodRepository: InMemoryFoodRepository;
let createFoodUseCase: CreateFoodUseCase;
let deleteFoodUseCase: DeleteFoodUseCase;

describe("delete food by id", () => {
  beforeEach(() => {
    foodRepository = new InMemoryFoodRepository();
    createFoodUseCase = new CreateFoodUseCase(foodRepository);
    deleteFoodUseCase = new DeleteFoodUseCase(foodRepository);
  });

  it("should be possible to delete a food by id", async () => {
    const foodCreated = await createFoodUseCase.execute({
      food_name: "Macarrão",
      price: 21.99,
      description: "Macarrão ao molho branco com um sabor delicioso",
      category: "Comida",
      image: "https://img.freepik.com/fotos-gratis/tela-vazia-branca_1194-7555.jpg",
    });

    if (foodCreated.isFailure()) return;

    const id = foodCreated.value.id;

    const food = await deleteFoodUseCase.execute({ id });

    expect(food.isSuccess()).toBe(true);
  });

  it("should not be possible to delete a food if the food is not found", async () => {
    await createFoodUseCase.execute({
      food_name: "Macarrão",
      price: 21.99,
      description: "Macarrão ao molho branco com um sabor delicioso",
      category: "Comida",
      image: "https://img.freepik.com/fotos-gratis/tela-vazia-branca_1194-7555.jpg",
    });

    const food = await deleteFoodUseCase.execute({ id: "12031903281390" });

    expect(food.isFailure()).toBe(true);
    expect(food.value).toBeInstanceOf(NotFoundError);
  });
});
