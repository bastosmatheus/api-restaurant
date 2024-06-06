import { z } from "zod";
import { HttpServer } from "../../infraestructure/http/http-server";
import { Deliveryman } from "../../core/entities/deliveryman";
import { UpdatePasswordDeliverymanUseCase } from "../../application/use-cases/deliveryman/update-password-deliveryman-use-case";
import { UpdateDeliverymanUseCase } from "../../application/use-cases/deliveryman/update-deliveryman-use-case";
import { CreateDeliverymanUseCase } from "../../application/use-cases/deliveryman/create-deliveryman-use-case";
import { DeleteDeliverymanUseCase } from "../../application/use-cases/deliveryman/delete-deliveryman-use-case";
import { FindAllDeliverymansUseCase } from "../../application/use-cases/deliveryman/find-all-deliverymans-use-case";
import { FindDeliverymanByIdUseCase } from "../../application/use-cases/deliveryman/find-deliveryman-by-id-use-case";
import { FindDeliverymanByEmailUseCase } from "../../application/use-cases/deliveryman/find-deliveryman-by-email-use-case";

class DeliverymanController {
  constructor(
    private readonly httpServer: HttpServer,
    private readonly findAllDeliverymansUseCase: FindAllDeliverymansUseCase,
    private readonly findDeliverymanByIdUseCase: FindDeliverymanByIdUseCase,
    private readonly findDeliverymanByEmailUseCase: FindDeliverymanByEmailUseCase,
    private readonly createDeliverymanUseCase: CreateDeliverymanUseCase,
    private readonly updateDeliverymanUseCase: UpdateDeliverymanUseCase,
    private readonly updatePasswordDeliverymanUseCase: UpdatePasswordDeliverymanUseCase,
    private readonly deleteDeliverymanUseCase: DeleteDeliverymanUseCase
  ) {
    this.httpServer.on("get", "/deliverymans", async () => {
      const deliverymans = await this.findAllDeliverymansUseCase.execute();

      return {
        type: "OK",
        statusCode: 200,
        deliverymans,
      };
    });

    this.httpServer.on(
      "get",
      "/deliverymans/:{id}",
      async (params: { id: string }, body: unknown) => {
        const findDeliverymanByIdSchema = z.object({
          id: z.string().uuid({
            message: "O ID deve ser um uuid",
          }),
        });

        const { id } = params;

        findDeliverymanByIdSchema.parse({ id });

        const deliveryman = await this.findDeliverymanByIdUseCase.execute({ id });

        if (deliveryman.isFailure()) {
          return {
            type: deliveryman.value.type,
            statusCode: deliveryman.value.statusCode,
            message: deliveryman.value.message,
          };
        }

        return {
          type: "OK",
          statusCode: 200,
          deliveryman: {
            ...deliveryman.value,
          },
        };
      }
    );

    this.httpServer.on(
      "get",
      "/deliverymans/email/:{email}",
      async (params: { email: string }, body: unknown) => {
        const findDeliverymanByEmailSchema = z.object({
          email: z
            .string({
              invalid_type_error: "O email deve ser uma string",
              required_error: "Informe o email",
            })
            .email({ message: "Email inválido" }),
        });

        const { email } = params;

        findDeliverymanByEmailSchema.parse({ email });

        const deliveryman = await this.findDeliverymanByEmailUseCase.execute({ email });

        if (deliveryman.isFailure()) {
          return {
            type: deliveryman.value.type,
            statusCode: deliveryman.value.statusCode,
            message: deliveryman.value.message,
          };
        }

        return {
          type: "OK",
          statusCode: 200,
          deliveryman: {
            ...deliveryman.value,
          },
        };
      }
    );

    this.httpServer.on("post", "/deliverymans", async (params: unknown, body: Deliveryman) => {
      const createDeliverymanSchema = z.object({
        name: z
          .string({
            invalid_type_error: "O nome deve ser uma string",
            required_error: "Informe o nome",
          })
          .min(3, { message: "O nome deve ter no minimo 3 caracteres" }),
        email: z
          .string({
            invalid_type_error: "O email deve ser uma string",
            required_error: "Informe o email",
          })
          .email({ message: "Email inválido" }),
        password: z
          .string({
            required_error: "Informe a senha",
            invalid_type_error: "A senha deve ser uma string",
          })
          .min(5, { message: "A senha deve ter no mínimo 5 caracteres" }),
        birthday_date: z.coerce.date({
          required_error: "Informe a data",
          invalid_type_error: "Informe uma data",
        }),
      });

      const { name, email, password, birthday_date } = body;

      createDeliverymanSchema.parse({
        name,
        email,
        password,
        birthday_date,
      });

      const deliveryman = await this.createDeliverymanUseCase.execute({
        name,
        email,
        password,
        birthday_date,
      });

      if (deliveryman.isFailure()) {
        return {
          type: deliveryman.value.type,
          statusCode: deliveryman.value.statusCode,
          message: deliveryman.value.message,
        };
      }

      return {
        type: "Created",
        statusCode: 201,
        deliveryman: {
          ...deliveryman.value,
        },
      };
    });

    this.httpServer.on(
      "put",
      "/deliverymans/:{id}",
      async (params: { id: string }, body: Deliveryman) => {
        const updateDeliverymanSchema = z.object({
          id: z.string().uuid({
            message: "O ID deve ser um uuid",
          }),
          name: z.string({
            invalid_type_error: "O nome deve ser uma string",
            required_error: "Informe o nome",
          }),
        });

        const { id } = params;
        const { name } = body;

        updateDeliverymanSchema.parse({ id, name });

        const deliveryman = await this.updateDeliverymanUseCase.execute({
          id,
          name,
        });

        if (deliveryman.isFailure()) {
          return {
            type: deliveryman.value.type,
            statusCode: deliveryman.value.statusCode,
            message: deliveryman.value.message,
          };
        }

        return {
          type: "OK",
          statusCode: 200,
          deliveryman: {
            ...deliveryman.value,
          },
        };
      }
    );

    this.httpServer.on(
      "patch",
      "/deliverymans/:{id}",
      async (params: { id: string }, body: Deliveryman) => {
        const updatePasswordSchema = z.object({
          id: z.string().uuid({
            message: "O ID deve ser um uuid",
          }),
          password: z
            .string({
              required_error: "Informe a nova senha",
              invalid_type_error: "A senha deve ser uma string",
            })
            .min(5, { message: "A senha deve ter no mínimo 5 caracteres" }),
        });

        const { id } = params;
        const { password } = body;

        updatePasswordSchema.parse({
          id,
          password,
        });

        const deliveryman = await this.updatePasswordDeliverymanUseCase.execute({
          id,
          password,
        });

        if (deliveryman.isFailure()) {
          return {
            type: deliveryman.value.type,
            statusCode: deliveryman.value.statusCode,
            message: deliveryman.value.message,
          };
        }

        return {
          type: "OK",
          statusCode: 200,
          deliveryman: {
            ...deliveryman.value,
          },
        };
      }
    );

    this.httpServer.on(
      "delete",
      "/deliverymans/:{id}",
      async (params: { id: string }, body: unknown) => {
        const deleteDeliverymanSchema = z.object({
          id: z.string().uuid({
            message: "O ID deve ser um uuid",
          }),
        });

        const { id } = params;

        deleteDeliverymanSchema.parse({ id });

        const deliveryman = await this.deleteDeliverymanUseCase.execute({ id });

        if (deliveryman.isFailure()) {
          return {
            type: deliveryman.value.type,
            statusCode: deliveryman.value.statusCode,
            message: deliveryman.value.message,
          };
        }

        return {
          type: "OK",
          statusCode: 200,
          deliveryman: {
            ...deliveryman.value,
          },
        };
      }
    );
  }
}

export { DeliverymanController };
