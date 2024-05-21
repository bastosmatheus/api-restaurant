import { NotFoundError } from "../errors/not-found-error";
import { CreateFoodUseCase } from "./create-food-use-case";
import { UpdateFoodUseCase } from "./update-food-use-case";
import { InMemoryFoodRepository } from "../../../infraestructure/repositories/in-memory/in-memory-food-repository";
import { describe, it, beforeEach, expect } from "vitest";
import { ConflictError } from "../errors/conflict-error";

let foodRepository: InMemoryFoodRepository;
let createFoodUseCase: CreateFoodUseCase;
let updateFoodUseCase: UpdateFoodUseCase;

describe("update food by id", () => {
  beforeEach(() => {
    foodRepository = new InMemoryFoodRepository();
    createFoodUseCase = new CreateFoodUseCase(foodRepository);
    updateFoodUseCase = new UpdateFoodUseCase(foodRepository);
  });

  it("should be possible to update a food by id", async () => {
    const foodCreated = await createFoodUseCase.execute({
      food_name: "Macarrão",
      price: 21.99,
      description: "Macarrão ao molho branco com um sabor delicioso",
      category: "Comida",
      image: "https://img.freepik.com/fotos-gratis/tela-vazia-branca_1194-7555.jpg",
    });

    if (foodCreated.isFailure()) return;

    const id = foodCreated.value.id;

    const food = await updateFoodUseCase.execute({
      id,
      food_name: "Macarrão",
      price: 21.99,
      description: "Macarrão ao molho branco com um sabor delicioso",
      category: "Comida",
      image: "https://img.freepik.com/fotos-gratis/tela-vazia-branca_1194-7555.jpg",
    });

    expect(food.isSuccess()).toBe(true);
  });

  it("should not be possible to update a food if the id does not exist", async () => {
    await createFoodUseCase.execute({
      food_name: "Macarrão",
      price: 21.99,
      description: "Macarrão ao molho branco com um sabor delicioso",
      category: "Comida",
      image: "https://img.freepik.com/fotos-gratis/tela-vazia-branca_1194-7555.jpg",
    });

    const food = await updateFoodUseCase.execute({ id: "1020304050" });

    expect(food.isFailure()).toBe(true);
    expect(food.value).toBeInstanceOf(NotFoundError);
  });

  it("should not be possible to update a food if the name already exists", async () => {
    await createFoodUseCase.execute({
      food_name: "Baião de II",
      price: 34.99,
      description:
        "Baião de dois é um prato tipico da região Nordeste. Consiste num preparado de arroz e feijão.",
      category: "Comida",
      image: "https://img.freepik.com/fotos-gratis/tela-vazia-branca_1194-7555.jpg",
    });

    const foodCreated = await createFoodUseCase.execute({
      food_name: "Macarrão",
      price: 21.99,
      description: "Macarrão ao molho branco com um sabor delicioso",
      category: "Comida",
      image: "https://img.freepik.com/fotos-gratis/tela-vazia-branca_1194-7555.jpg",
    });

    if (foodCreated.isFailure()) return;

    const id = foodCreated.value.id;

    const food = await updateFoodUseCase.execute({
      id,
      food_name: "Baião de II",
      price: 30.99,
      description: "Baião de dois muito bom",
      category: "Comida",
      image: "https://img.freepik.com/fotos-gratis/tela-vazia-branca_1194-7555.jpg",
    });

    expect(food.isFailure()).toBe(true);
    expect(food.value).toBeInstanceOf(ConflictError);
  });
});
