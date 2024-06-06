import { z } from "zod";
import { Delivery } from "../../core/entities/delivery";
import { HttpServer } from "../../infraestructure/http/http-server";
import {
  CreateDeliveryUseCase,
  DeliveryAcceptedUseCase,
  DeliveryCompletedUseCase,
  FindAllDeliveriesUseCase,
  FindDeliveriesByDeliverymanUseCase,
  FindDeliveriesByNotAcceptedUseCase,
  FindDeliveryByIdUseCase,
} from "../../application/use-cases/delivery";

class DeliveryController {
  constructor(
    private readonly httpServer: HttpServer,
    private readonly findAllDeliveriesUseCase: FindAllDeliveriesUseCase,
    private readonly findDeliveriesByNotAcceptedUseCase: FindDeliveriesByNotAcceptedUseCase,
    private readonly findDeliveriesByDeliverymanUseCase: FindDeliveriesByDeliverymanUseCase,
    private readonly findDeliveryByIdUseCase: FindDeliveryByIdUseCase,
    private readonly createDeliveryUseCase: CreateDeliveryUseCase,
    private readonly deliveryAcceptedUseCase: DeliveryAcceptedUseCase,
    private readonly deliveryCompletedUseCase: DeliveryCompletedUseCase
  ) {
    this.httpServer.on("get", "/deliveries", async () => {
      const deliveries = await this.findAllDeliveriesUseCase.execute();

      return {
        type: "OK",
        statusCode: 200,
        deliveries,
      };
    });

    this.httpServer.on("get", "/deliveries/not_accepted", async () => {
      const deliveries = await this.findDeliveriesByNotAcceptedUseCase.execute();

      return {
        type: "OK",
        statusCode: 200,
        deliveries,
      };
    });

    this.httpServer.on(
      "get",
      "/deliveries/deliveryman/:{id_deliveryman}",
      async (params: { id_deliveryman: string | null }, body: unknown) => {
        const findDeliveriesByDeliverymanSchema = z.object({
          id_deliveryman: z.string().uuid({
            message: "O ID deve ser um uuid",
          }),
        });

        let { id_deliveryman } = params;

        id_deliveryman === "null" ? (id_deliveryman = null) : id_deliveryman;

        findDeliveriesByDeliverymanSchema.parse({ id_deliveryman });

        const deliveries = await this.findDeliveriesByDeliverymanUseCase.execute({
          id_deliveryman,
        });

        return {
          type: "OK",
          statusCode: 200,
          deliveries,
        };
      }
    );

    this.httpServer.on(
      "get",
      "/deliveries/:{id}",
      async (params: { id: string }, body: unknown) => {
        const findDeliveryByIdSchema = z.object({
          id: z.string().uuid({
            message: "O ID deve ser um uuid",
          }),
        });

        const { id } = params;

        findDeliveryByIdSchema.parse({ id });

        const delivery = await this.findDeliveryByIdUseCase.execute({ id });

        if (delivery.isFailure()) {
          return {
            type: delivery.value.type,
            statusCode: delivery.value.statusCode,
            message: delivery.value.message,
          };
        }

        return {
          type: "OK",
          statusCode: 200,
          delivery: {
            ...delivery.value,
          },
        };
      }
    );

    this.httpServer.on("post", "/deliveries", async (params: unknown, body: Delivery) => {
      const createDeliverySchema = z.object({
        id_order: z.string().uuid({
          message: "O ID do pedido deve ser um uuid",
        }),
      });

      const { id_order } = body;

      createDeliverySchema.parse({ id_order });

      const delivery = await this.createDeliveryUseCase.execute({ id_order });

      if (delivery.isFailure()) {
        return {
          type: delivery.value.type,
          statusCode: delivery.value.statusCode,
          message: delivery.value.message,
        };
      }

      return {
        type: "Created",
        statusCode: 201,
        delivery: {
          ...delivery.value,
        },
      };
    });

    this.httpServer.on(
      "patch",
      "/deliveries/:{id}/deliveryman/:{id_deliveryman}",
      async (params: { id: string; id_deliveryman: string }, body: unknown) => {
        const deliveryAcceptedSchema = z.object({
          id: z.string().uuid({
            message: "O ID deve ser um uuid",
          }),
          id_deliveryman: z.string().uuid({
            message: "O ID do entregador deve ser um uuid",
          }),
        });

        const { id, id_deliveryman } = params;

        deliveryAcceptedSchema.parse({ id, id_deliveryman });

        const delivery = await this.deliveryAcceptedUseCase.execute({ id, id_deliveryman });

        if (delivery.isFailure()) {
          return {
            type: delivery.value.type,
            statusCode: delivery.value.statusCode,
            message: delivery.value.message,
          };
        }

        return {
          type: "OK",
          statusCode: 200,
          delivery: {
            ...delivery.value,
          },
        };
      }
    );

    this.httpServer.on(
      "patch",
      "/deliveries/:{id}",
      async (params: { id: string }, body: unknown) => {
        const deliveryCompletedSchema = z.object({
          id: z.string().uuid({
            message: "O ID deve ser um uuid",
          }),
        });

        const { id } = params;

        deliveryCompletedSchema.parse({ id });

        const delivery = await this.deliveryCompletedUseCase.execute({ id });

        if (delivery.isFailure()) {
          return {
            type: delivery.value.type,
            statusCode: delivery.value.statusCode,
            message: delivery.value.message,
          };
        }

        return {
          type: "OK",
          statusCode: 200,
          delivery: {
            ...delivery.value,
          },
        };
      }
    );
  }
}

export { DeliveryController };
