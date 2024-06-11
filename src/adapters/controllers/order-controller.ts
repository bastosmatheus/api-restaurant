import { z } from "zod";
import { HttpServer } from "../../infraestructure/http/http-server";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { RoleMiddleware } from "../middlewares/role-middleware";
import { Order, StatusOrder } from "../../core/entities/order";
import {
  CreateOrderUseCase,
  FindAllOrdersUseCase,
  FindOrderByIdUseCase,
  FindOrdersByCardUseCase,
  FindOrdersByCardsUseCase,
  FindOrdersByPixsUseCase,
  FindOrdersByStatusUseCase,
  FindOrdersByUserUseCase,
  UpdateStatusOrderUseCase,
} from "../../application/use-cases/order";

class OrderController {
  constructor(
    private readonly httpServer: HttpServer,
    private readonly findAllOrdersUseCase: FindAllOrdersUseCase,
    private readonly findOrdersByCardsUseCase: FindOrdersByCardsUseCase,
    private readonly findOrderByPixsUseCase: FindOrdersByPixsUseCase,
    private readonly findOrdersByCardUseCase: FindOrdersByCardUseCase,
    private readonly findOrdersByUserUseCase: FindOrdersByUserUseCase,
    private readonly findOrdersByStatusUseCase: FindOrdersByStatusUseCase,
    private readonly findOrderByIdUseCase: FindOrderByIdUseCase,
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly updateStatusOrderUseCase: UpdateStatusOrderUseCase
  ) {
    this.httpServer.on("get", [], "/orders", async () => {
      const orders = await this.findAllOrdersUseCase.execute();

      return {
        type: "OK",
        statusCode: 200,
        orders,
      };
    });

    this.httpServer.on("get", [AuthMiddleware.verifyToken], "/orders/cards", async () => {
      const orders = await this.findOrdersByCardsUseCase.execute();

      return {
        type: "OK",
        statusCode: 200,
        orders,
      };
    });

    this.httpServer.on("get", [AuthMiddleware.verifyToken], "/orders/pixs", async () => {
      const orders = await this.findOrderByPixsUseCase.execute();

      return {
        type: "OK",
        statusCode: 200,
        orders,
      };
    });

    this.httpServer.on(
      "get",
      [AuthMiddleware.verifyToken],
      "/orders/card/:{id_card}",
      async (params: { id_card: string }, body: unknown) => {
        const findOrdersByCardSchema = z.object({
          id_card: z.string().uuid({
            message: "O ID deve ser um uuid",
          }),
        });

        const { id_card } = params;

        findOrdersByCardSchema.parse({ id_card });

        const orders = await this.findOrdersByCardUseCase.execute({ id_card });

        return {
          type: "OK",
          statusCode: 200,
          orders,
        };
      }
    );

    this.httpServer.on(
      "get",
      [AuthMiddleware.verifyToken],
      "/orders/user/:{id_user}",
      async (params: { id_user: string }, body: unknown) => {
        const findOrdersByUserSchema = z.object({
          id_user: z.string().uuid({
            message: "O ID deve ser um uuid",
          }),
        });

        const { id_user } = params;

        findOrdersByUserSchema.parse({ id_user });

        const orders = await this.findOrdersByUserUseCase.execute({ id_user });

        return {
          type: "OK",
          statusCode: 200,
          orders,
        };
      }
    );

    this.httpServer.on(
      "get",
      [AuthMiddleware.verifyToken],
      "/orders/status/:{status}",
      async (params: { status: StatusOrder }, body: unknown) => {
        const findOrdersByStatusSchema = z.object({
          status: z.enum(
            [
              "Aguardando pagamento",
              "Pagamento confirmado",
              "Preparando pedido",
              "Saiu para entrega",
              "Pedido concluido",
              "Cancelado",
            ],
            {
              errorMap: (status, ctx) => {
                if (status.code === "invalid_enum_value") {
                  return {
                    message:
                      "Informe um tipo válido de status: Aguardando pagamento, Pagamento confirmado, Preparando pedido, Saiu para entrega, Pedido Concluido ou Cancelado",
                  };
                }

                if (status.code === "invalid_type" && status.received === "undefined") {
                  return {
                    message: "Informe o status do pedido",
                  };
                }

                if (status.code === "invalid_type" && status.received !== "string") {
                  return {
                    message: "O status do pedido deve ser uma string",
                  };
                }
              },
            }
          ),
        });

        const { status } = params;

        findOrdersByStatusSchema.parse({ status });

        const orders = await this.findOrdersByStatusUseCase.execute({ status });

        return {
          type: "OK",
          statusCode: 200,
          orders,
        };
      }
    );

    this.httpServer.on(
      "get",
      [AuthMiddleware.verifyToken],
      "/orders/:{id}",
      async (params: { id: string }, body: unknown) => {
        const findOrderByIdSchema = z.object({
          id: z.string().uuid({
            message: "O ID deve ser um uuid",
          }),
        });

        const { id } = params;

        findOrderByIdSchema.parse({ id });

        const order = await this.findOrderByIdUseCase.execute({ id });

        if (order.isFailure()) {
          return {
            type: order.value.type,
            statusCode: order.value.statusCode,
            message: order.value.message,
          };
        }

        return {
          type: "OK",
          statusCode: 200,
          order: {
            ...order.value,
          },
        };
      }
    );

    this.httpServer.on(
      "post",
      [AuthMiddleware.verifyToken],
      "/orders",
      async (params: unknown, body: Order) => {
        const createOrderSchema = z.object({
          id_user: z.string().uuid({
            message: "O ID do usuário deve ser um uuid",
          }),
          id_pix: z.union([
            z.null({
              required_error: "O ID do pix é obrigatório",
              invalid_type_error: "O ID do pix deve ser um string ou nulo",
            }),
            z
              .string({
                required_error: "O ID do pix é obrigatório",
                invalid_type_error: "O ID do pix deve ser uma string ou nulo",
              })
              .uuid({
                message: "O ID do pix deve ser um uuid",
              }),
          ]),
          id_card: z.union([
            z.null({
              required_error: "O ID do cartão é obrigatório",
              invalid_type_error: "O ID do cartão deve ser um string ou nulo",
            }),
            z
              .string({
                required_error: "O ID do cartão é obrigatório",
                invalid_type_error: "O ID do cartão deve ser um string ou nulo",
              })
              .uuid({
                message: "O ID do cartão deve ser um uuid",
              }),
          ]),
        });

        const { id_user, id_pix, id_card } = body;

        createOrderSchema.parse({ id_user, id_pix, id_card });

        const order = await this.createOrderUseCase.execute({ id_user, id_pix, id_card });

        if (order.isFailure()) {
          return {
            type: order.value.type,
            statusCode: order.value.statusCode,
            message: order.value.message,
          };
        }

        return {
          type: "Created",
          statusCode: 201,
          order: {
            ...order.value,
          },
        };
      }
    );

    this.httpServer.on(
      "patch",
      [RoleMiddleware.verifyRole],
      "/orders/:{id}",
      async (params: { id: string }, body: Order) => {
        const updateStatusOrderSchema = z.object({
          id: z.string().uuid({
            message: "O ID deve ser um uuid",
          }),
          status: z.enum(["Pagamento confirmado", "Preparando pedido", "Cancelado"], {
            errorMap: (status, ctx) => {
              if (status.code === "invalid_enum_value") {
                return {
                  message:
                    "Informe um tipo válido de status: Pagamento confirmado, Preparando pedido ou Cancelado",
                };
              }

              if (status.code === "invalid_type" && status.received === "undefined") {
                return {
                  message: "Informe o status do pedido",
                };
              }

              if (status.code === "invalid_type" && status.received !== "string") {
                return {
                  message: "O status do pedido deve ser uma string",
                };
              }
            },
          }),
        });

        const { id } = params;
        const { status } = body;

        updateStatusOrderSchema.parse({ id, status });

        const order = await this.updateStatusOrderUseCase.execute({ id, status });

        if (order.isFailure()) {
          return {
            type: order.value.type,
            statusCode: order.value.statusCode,
            message: order.value.message,
          };
        }

        return {
          type: "OK",
          statusCode: 200,
          order: {
            ...order.value,
          },
        };
      }
    );
  }
}

export { OrderController };
