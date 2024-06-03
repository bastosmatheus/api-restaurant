import { z } from "zod";
import { Card } from "../../core/entities/card";
import { HttpServer } from "../../infraestructure/http/http-server";
import { CreateCardUseCase } from "../../application/use-cases/card/create-card-use-case";
import { DeleteCardUseCase } from "../../application/use-cases/card/delete-card-use-case";
import { FindAllCardsUseCase } from "../../application/use-cases/card/find-all-cards-use-case";
import { FindCardByIdUseCase } from "../../application/use-cases/card/find-card-by-id-use-case";
import { FindCardsByUserUseCase } from "../../application/use-cases/card/find-cards-by-user-use-case";
import { FindCardByCardNumberUseCase } from "../../application/use-cases/card/find-card-by-card-number-use-case";

class CardController {
  constructor(
    private readonly httpServer: HttpServer,
    private readonly findAllCardsUseCase: FindAllCardsUseCase,
    private readonly findCardsByUserUseCase: FindCardsByUserUseCase,
    private readonly findCardByIdUseCase: FindCardByIdUseCase,
    private readonly findCardByCardNumberUseCase: FindCardByCardNumberUseCase,
    private readonly createCardUseCase: CreateCardUseCase,
    private readonly deleteCardUseCase: DeleteCardUseCase
  ) {
    this.httpServer.on("get", "/cards", async () => {
      const cards = await this.findAllCardsUseCase.execute();

      return {
        type: "OK",
        statusCode: 200,
        cards,
      };
    });

    this.httpServer.on(
      "get",
      "/cards/user/${id_user}",
      async (params: { id_user: string }, body: unknown) => {
        const findCardsByUserSchema = z.object({
          id_user: z.string().uuid({
            message: "O ID deve ser um uuid",
          }),
        });

        const { id_user } = params;

        findCardsByUserSchema.parse({ id_user });

        const cards = await this.findCardsByUserUseCase.execute({ id_user });

        return {
          type: "OK",
          statusCode: 200,
          cards,
        };
      }
    );

    this.httpServer.on("get", "/cards/:{id}", async (params: { id: string }, body: unknown) => {
      const findCardByIdSchema = z.object({
        id: z.string().uuid({
          message: "O ID deve ser um uuid",
        }),
      });

      const { id } = params;

      findCardByIdSchema.parse({ id });

      const card = await this.findCardByIdUseCase.execute({ id });

      if (card.isFailure()) {
        return {
          type: card.value.type,
          statusCode: card.value.statusCode,
          message: card.value.message,
        };
      }

      return {
        type: "OK",
        statusCode: 200,
        card: {
          ...card.value,
        },
      };
    });

    this.httpServer.on(
      "get",
      "/cards/card_number/:{card_number}",
      async (params: { card_number: number }, body: unknown) => {
        const findCardByCardNumberSchema = z.object({
          card_number: z
            .number({
              required_error: "Informe o número do cartão",
              invalid_type_error: "O número do cartão deve ser um número",
            })
            .min(14, { message: "O número do cartão deve ter no mínimo 14 dígitos" })
            .max(16, { message: "O número do cartão deve ter no máximo 16 dígitos" }),
        });

        const { card_number } = params;

        findCardByCardNumberSchema.parse({ card_number });

        const card = await this.findCardByCardNumberUseCase.execute({ card_number });

        if (card.isFailure()) {
          return {
            type: card.value.type,
            statusCode: card.value.statusCode,
            message: card.value.message,
          };
        }

        return {
          type: "OK",
          statusCode: 200,
          card: {
            ...card.value,
          },
        };
      }
    );

    this.httpServer.on("post", "/cards", async (params: unknown, body: Card) => {
      const createCardSchema = z.object({
        card_holder_name: z
          .string({
            required_error: "Informe o titular do cartão",
            invalid_type_error: "O nome do titular deve ser uma string",
          })
          .min(2, { message: "O nome do titular deve ter pelo menos 2 caracteres" }),
        card_number: z.coerce
          .string({
            required_error: "Informe o número do cartão",
            invalid_type_error: "Informe um número de cartão",
          })
          .min(14, { message: "O número do cartão deve ter no mínimo 14 dígitos" })
          .max(16, { message: "O número do cartão deve ter no máximo 16 dígitos" }),
        expiration_date: z.coerce.date({
          required_error: "Informe a data de expiração do cartão",
          invalid_type_error: "Informe uma data válida de expiração do cartão",
        }),
        id_user: z.string().uuid({
          message: "O ID deve ser um uuid",
        }),
      });

      const { card_holder_name, card_number, expiration_date, id_user } = body;

      createCardSchema.parse({
        card_holder_name,
        card_number,
        expiration_date,
        id_user,
      });

      const card = await this.createCardUseCase.execute({
        card_holder_name,
        card_number,
        expiration_date,
        id_user,
      });

      if (card.isFailure()) {
        return {
          type: card.value.type,
          statusCode: card.value.statusCode,
          message: card.value.message,
        };
      }

      return {
        type: "Created",
        statusCode: 201,
        card: {
          ...card.value,
        },
      };
    });

    this.httpServer.on("delete", "/cards/:{id}", async (params: { id: string }, body: unknown) => {
      const deleteCardSchema = z.object({
        id: z.string().uuid({
          message: "O ID deve ser um uuid",
        }),
      });

      const { id } = params;

      deleteCardSchema.parse({ id });

      const card = await this.deleteCardUseCase.execute({ id });

      if (card.isFailure()) {
        return {
          type: card.value.type,
          statusCode: card.value.statusCode,
          message: card.value.message,
        };
      }

      return {
        type: "OK",
        statusCode: 200,
        card: {
          ...card.value,
        },
      };
    });
  }
}

export { CardController };
