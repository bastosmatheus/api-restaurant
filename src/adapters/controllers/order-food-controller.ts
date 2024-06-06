import { z } from "zod";
import { OrderFood } from "../../core/entities/order-food";
import { HttpServer } from "../../infraestructure/http/http-server";
import {
  CreateOrderFoodUseCase,
  FindAllOrdersFoodsUseCase,
  FindOrdersFoodsByFoodUseCase,
  FindOrderFoodByIdUseCase,
  FindOrdersFoodsByOrderUseCase,
} from "../../application/use-cases/order-food";

class OrderFoodController {
  constructor(
    private readonly httpServer: HttpServer,
    private readonly findAllOrdersFoodsUseCase: FindAllOrdersFoodsUseCase,
    private readonly findOrdersFoodsByFoodUseCase: FindOrdersFoodsByFoodUseCase,
    private readonly findOrdersFoodsByOrderUseCase: FindOrdersFoodsByOrderUseCase,
    private readonly findOrderFoodByIdUseCase: FindOrderFoodByIdUseCase,
    private readonly createOrderFoodUseCase: CreateOrderFoodUseCase
  ) {
    this.httpServer.on("get", "/orders_foods", async () => {
      const orderFood = await this.findAllOrdersFoodsUseCase.execute();

      return {
        type: "OK",
        statusCode: 200,
        orderFood,
      };
    });

    this.httpServer.on(
      "get",
      "/orders_foods/food/:{id_food}",
      async (params: { id_food: string }, body: unknown) => {
        const findOrderFoodByFoodSchema = z.object({
          id_food: z.string().uuid({
            message: "O ID deve ser um uuid",
          }),
        });

        const { id_food } = params;

        findOrderFoodByFoodSchema.parse({ id_food });

        const orderFood = await this.findOrdersFoodsByFoodUseCase.execute({ id_food });

        return {
          type: "OK",
          statusCode: 200,
          orderFood,
        };
      }
    );

    this.httpServer.on(
      "get",
      "/orders_foods/order/:{id_order}",
      async (params: { id_order: string }, body: unknown) => {
        const findOrderFoodByOrderSchema = z.object({
          id_order: z.string().uuid({
            message: "O ID deve ser um uuid",
          }),
        });

        const { id_order } = params;

        findOrderFoodByOrderSchema.parse({ id_order });

        const orderFood = await this.findOrdersFoodsByOrderUseCase.execute({ id_order });

        return {
          type: "OK",
          statusCode: 200,
          orderFood,
        };
      }
    );

    this.httpServer.on(
      "get",
      "/orders_foods/:{id}",
      async (params: { id: string }, body: unknown) => {
        const findOrderFoodByIdSchema = z.object({
          id: z.string().uuid({
            message: "O ID deve ser um uuid",
          }),
        });

        const { id } = params;

        findOrderFoodByIdSchema.parse({ id });

        const orderFood = await this.findOrderFoodByIdUseCase.execute({ id });

        if (orderFood.isFailure()) {
          return {
            type: orderFood.value.type,
            statusCode: orderFood.value.statusCode,
            message: orderFood.value.message,
          };
        }

        return {
          type: "OK",
          statusCode: 200,
          orderFood: {
            ...orderFood.value,
          },
        };
      }
    );

    this.httpServer.on("post", "/orders_foods", async (params: unknown, body: OrderFood) => {
      const createOrderFoodSchema = z.object({
        quantity: z
          .number({
            required_error: "Informe a quantidade a ser adicionada",
            invalid_type_error: "A quantidade deve ser um número",
          })
          .min(1, { message: "A quantidade não pode ser menor que 1" }),
        id_order: z.string().uuid({
          message: "O ID do pedido deve ser um uuid",
        }),
        id_food: z.string().uuid({
          message: "O ID do alimento deve ser um uuid",
        }),
      });

      const { quantity, id_order, id_food } = body;

      createOrderFoodSchema.parse({ quantity, id_order, id_food });

      const orderFood = await this.createOrderFoodUseCase.execute({
        quantity,
        id_order,
        id_food,
      });

      if (orderFood.isFailure()) {
        return {
          type: orderFood.value.type,
          statusCode: orderFood.value.statusCode,
          message: orderFood.value.message,
        };
      }

      return {
        type: "Created",
        statusCode: 201,
        orderFood: {
          ...orderFood.value,
        },
      };
    });
  }
}

export { OrderFoodController };
