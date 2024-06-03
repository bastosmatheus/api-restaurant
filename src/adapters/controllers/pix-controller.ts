import { z } from "zod";
import { HttpServer } from "../../infraestructure/http/http-server";
import { Pix, StatusPix } from "../../core/entities/pix";
import { CreatePixUseCase } from "../../application/use-cases/pix/create-pix-use-case";
import { FindAllPixsUseCase } from "../../application/use-cases/pix/find-all-pixs-use-case";
import { FindPixByIdUseCase } from "../../application/use-cases/pix/find-pix-by-id-use-case";
import { FindPixByCodeUseCase } from "../../application/use-cases/pix/find-pix-by-code-use-case";
import { FindPixsByUserUseCase } from "../../application/use-cases/pix/find-pixs-by-user-use-case";
import { UpdateStatusPixUseCase } from "../../application/use-cases/pix/update-status-pix-use-case";
import { FindPixsByStatusUseCase } from "../../application/use-cases/pix/find-pixs-by-status-use-case";

class PixController {
  constructor(
    private readonly httpServer: HttpServer,
    private readonly findAllPixsUseCase: FindAllPixsUseCase,
    private readonly findPixsByUserUseCase: FindPixsByUserUseCase,
    private readonly findPixsByStatusUseCase: FindPixsByStatusUseCase,
    private readonly findPixByIdUseCase: FindPixByIdUseCase,
    private readonly findPixByCodeUseCase: FindPixByCodeUseCase,
    private readonly createPixUseCase: CreatePixUseCase,
    private readonly updateStatusPixUseCase: UpdateStatusPixUseCase
  ) {
    this.httpServer.on("get", "/pixs", async () => {
      const pixs = await this.findAllPixsUseCase.execute();

      return {
        type: "OK",
        statusCode: 200,
        pixs,
      };
    });

    this.httpServer.on(
      "get",
      "/pixs/user/:{id_user}",
      async (params: { id_user: string }, body: unknown) => {
        const findPixsByUserSchema = z.object({
          id_user: z.string().uuid({
            message: "O ID deve ser um uuid",
          }),
        });

        const { id_user } = params;

        findPixsByUserSchema.parse({ id_user });

        const pixs = await this.findPixsByUserUseCase.execute({ id_user });

        return {
          type: "OK",
          statusCode: 200,
          pixs,
        };
      }
    );

    this.httpServer.on(
      "get",
      "/pixs/status/:{status}",
      async (params: { status: StatusPix }, body: unknown) => {
        const findPixsByStatusSchema = z.object({
          status: z.enum(["Aguardando pagamento", "Pago", "Expirado"], {
            errorMap: (status, ctx) => {
              if (status.code === "invalid_enum_value") {
                return {
                  message:
                    "Informe um tipo válido de status: Aguardando pagamento, Pago ou Expirado",
                };
              }

              if (status.code === "invalid_type" && status.received === "undefined") {
                return {
                  message: "Informe o status",
                };
              }

              if (status.code === "invalid_type" && status.received !== "string") {
                return {
                  message: "O status deve ser uma string",
                };
              }
            },
          }),
        });

        const { status } = params;

        findPixsByStatusSchema.parse({ status });

        const pixs = await this.findPixsByStatusUseCase.execute({ status });

        return {
          type: "OK",
          statusCode: 200,
          pixs,
        };
      }
    );

    this.httpServer.on("get", "/pixs/:{id}", async (params: { id: string }, body: unknown) => {
      const findPixByIdSchema = z.object({
        id: z.string().uuid({
          message: "O ID deve ser um uuid",
        }),
      });

      const { id } = params;

      findPixByIdSchema.parse({ id });

      const pix = await this.findPixByIdUseCase.execute({ id });

      if (pix.isFailure()) {
        return {
          type: pix.value.type,
          statusCode: pix.value.statusCode,
          message: pix.value.message,
        };
      }

      return {
        type: "OK",
        statusCode: 200,
        pix: {
          ...pix.value,
        },
      };
    });

    this.httpServer.on(
      "get",
      "/pixs/code/:{code}",
      async (params: { code: string }, body: unknown) => {
        const findPixByCodeSchema = z.object({
          code: z.string({
            invalid_type_error: "O código pix deve ser uma string",
            required_error: "Informe o código pix",
          }),
        });

        const { code } = params;

        findPixByCodeSchema.parse({ code });

        const pix = await this.findPixByCodeUseCase.execute({ code });

        if (pix.isFailure()) {
          return {
            type: pix.value.type,
            statusCode: pix.value.statusCode,
            message: pix.value.message,
          };
        }

        return {
          type: "OK",
          statusCode: 200,
          pix: {
            ...pix.value,
          },
        };
      }
    );

    this.httpServer.on("post", "/pixs", async (params: unknown, body: Pix) => {
      const createPixSchema = z.object({
        id_user: z.string().uuid({
          message: "O ID deve ser um uuid",
        }),
      });

      const { id_user } = body;

      createPixSchema.parse({ id_user });

      const pix = await this.createPixUseCase.execute({ id_user });

      if (pix.isFailure()) {
        return {
          type: pix.value.type,
          statusCode: pix.value.statusCode,
          message: pix.value.message,
        };
      }

      return {
        type: "Created",
        statusCode: 201,
        pix: {
          ...pix.value,
        },
      };
    });

    this.httpServer.on("patch", "/pixs/:{id}", async (params: { id: string }, body: unknown) => {
      const updateStatusSchema = z.object({
        id: z.string().uuid({
          message: "O ID deve ser um uuid",
        }),
      });

      const { id } = params;

      updateStatusSchema.parse({ id });

      const pix = await this.updateStatusPixUseCase.execute({ id });

      if (pix.isFailure()) {
        return {
          type: pix.value.type,
          statusCode: pix.value.statusCode,
          message: pix.value.message,
        };
      }

      return {
        type: "OK",
        statusCode: 200,
        pix: {
          ...pix.value,
        },
      };
    });
  }
}

export { PixController };
