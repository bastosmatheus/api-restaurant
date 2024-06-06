import { BcryptAdapter } from "../../../infraestructure/cryptography/cryptography";
import { CreatePixUseCase } from "../pix";
import { CreateUserUseCase } from "../user";
import { CreateFoodUseCase } from "../food";
import { CreateOrderUseCase } from "../order/create-order-use-case";
import { InMemoryPixRepository } from "../../../infraestructure/repositories/in-memory/in-memory-pix-repository";
import { InMemoryFoodRepository } from "../../../infraestructure/repositories/in-memory/in-memory-food-repository";
import { InMemoryUserRepository } from "../../../infraestructure/repositories/in-memory/in-memory-user-repository";
import { InMemoryCardRepository } from "../../../infraestructure/repositories/in-memory/in-memory-card-repository";
import { CreateOrderFoodUseCase } from "./create-order-food-use-case";
import { InMemoryOrderRepository } from "../../../infraestructure/repositories/in-memory/in-memory-order-repository";
import { FindAllOrdersFoodsUseCase } from "./find-all-orders-foods-use-case";
import { InMemoryOrderFoodRepository } from "../../../infraestructure/repositories/in-memory/in-memory-order-food-repository";
import { describe, it, beforeEach, expect } from "vitest";

let orderFoodRepository: InMemoryOrderFoodRepository;
let orderRepository: InMemoryOrderRepository;
let foodRepository: InMemoryFoodRepository;
let userRepository: InMemoryUserRepository;
let pixRepository: InMemoryPixRepository;
let cardRepository: InMemoryCardRepository;
let createUserUseCase: CreateUserUseCase;
let createPixUseCase: CreatePixUseCase;
let createOrderUseCase: CreateOrderUseCase;
let createFoodUseCase: CreateFoodUseCase;
let createOrderFoodUseCase: CreateOrderFoodUseCase;
let findAllOrdersFoodsUseCase: FindAllOrdersFoodsUseCase;
let bcryptAdapter: BcryptAdapter;

describe("get all order food", () => {
  beforeEach(() => {
    orderFoodRepository = new InMemoryOrderFoodRepository();
    foodRepository = new InMemoryFoodRepository();
    orderRepository = new InMemoryOrderRepository();
    userRepository = new InMemoryUserRepository();
    pixRepository = new InMemoryPixRepository();
    cardRepository = new InMemoryCardRepository();
    bcryptAdapter = new BcryptAdapter();
    createUserUseCase = new CreateUserUseCase(userRepository, bcryptAdapter);
    createPixUseCase = new CreatePixUseCase(pixRepository, userRepository);
    createOrderUseCase = new CreateOrderUseCase(
      orderRepository,
      userRepository,
      pixRepository,
      cardRepository
    );
    createFoodUseCase = new CreateFoodUseCase(foodRepository);
    createOrderFoodUseCase = new CreateOrderFoodUseCase(
      orderFoodRepository,
      orderRepository,
      foodRepository
    );
    findAllOrdersFoodsUseCase = new FindAllOrdersFoodsUseCase(orderFoodRepository);
  });

  it("should be possible to get all order food", async () => {
    const user = await createUserUseCase.execute({
      name: "Matheus",
      email: "matheus@gmail.com",
      password: "12345",
    });

    if (user.isFailure()) return;

    const id_user = user.value.id;

    const pix = await createPixUseCase.execute({ id_user });

    if (pix.isFailure()) return;

    const id_pix = pix.value.id;

    const order = await createOrderUseCase.execute({
      id_user,
      id_pix,
      id_card: null,
    });

    if (order.isFailure()) return;

    const id_order = order.value.id;

    const food = await createFoodUseCase.execute({
      food_name: "Macarrão",
      price: 21.99,
      description: "Macarrão ao molho branco com um sabor delicioso",
      category: "Comida",
      image: "https://img.freepik.com/fotos-gratis/tela-vazia-branca_1194-7555.jpg",
    });

    if (food.isFailure()) return;

    const id_food = food.value.id;

    await createOrderFoodUseCase.execute({ quantity: 1, id_order, id_food });
    await createOrderFoodUseCase.execute({ quantity: 2, id_order, id_food });

    const orderFood = await findAllOrdersFoodsUseCase.execute();

    expect(orderFood.length).toBeGreaterThanOrEqual(2);
  });
});
