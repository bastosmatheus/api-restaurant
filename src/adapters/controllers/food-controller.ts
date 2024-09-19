import { z } from "zod";
import { Food } from "../../core/entities/food";
import { HttpServer } from "../../infraestructure/http/http-server";
import { RoleMiddleware } from "../middlewares/role-middleware";
import {
  CreateFoodUseCase,
  DeleteFoodUseCase,
  FindAllFoodsUseCase,
  FindFoodByIdUseCase,
  FindFoodByNameUseCase,
  FindFoodsByCategoryUseCase,
  UpdateFoodUseCase,
} from "../../application/use-cases/food";

class FoodController {
  constructor(
    private readonly httpServer: HttpServer,
    private readonly findAllFoodsUseCase: FindAllFoodsUseCase,
    private readonly findFoodsByCategoryUseCase: FindFoodsByCategoryUseCase,
    private readonly findFoodByIdUseCase: FindFoodByIdUseCase,
    private readonly findFoodByNameUseCase: FindFoodByNameUseCase,
    private readonly createFoodUseCase: CreateFoodUseCase,
    private readonly updateFoodUseCase: UpdateFoodUseCase,
    private readonly deleteFoodUseCase: DeleteFoodUseCase
  ) {
    this.routes();
  }

  private routes() {
    this.httpServer.on("get", [], "/foods", async () => {
      const foods = await this.findAllFoodsUseCase.execute();

      return {
        type: "OK",
        statusCode: 200,
        foods,
      };
    });

    this.httpServer.on(
      "get",
      [],
      "/foods/category/:{category}",
      async (params: { category: string }, body: unknown) => {
        const findFoodsByCategorySchema = z.object({
          category: z
            .string({
              invalid_type_error: "A categoria do alimento deve ser uma string",
              required_error: "Informe a categoria do alimento",
            })
            .min(3, { message: "A categoria do alimento deve ter no minimo 3 caracteres" }),
        });

        const { category } = params;

        findFoodsByCategorySchema.parse({ category });

        const foods = await this.findFoodsByCategoryUseCase.execute({ category });

        return {
          type: "OK",
          statusCode: 200,
          foods,
        };
      }
    );

    this.httpServer.on("get", [], "/foods/:{id}", async (params: { id: string }, body: unknown) => {
      const findFoodByIdSchema = z.object({
        id: z.string().uuid({ message: "O ID deve ser um uuid" }),
      });

      const { id } = params;

      findFoodByIdSchema.parse({ id });

      const food = await this.findFoodByIdUseCase.execute({ id });

      if (food.isFailure()) {
        return {
          type: food.value.type,
          statusCode: food.value.statusCode,
          message: food.value.message,
        };
      }

      return {
        type: "OK",
        statusCode: 200,
        food: {
          ...food.value,
        },
      };
    });

    this.httpServer.on(
      "get",
      [],
      "/foods/name/:{food_name}",
      async (params: { food_name: string }, body: unknown) => {
        const findFoodByNameSchema = z.object({
          food_name: z
            .string({
              invalid_type_error: "O nome do alimento deve ser uma string",
              required_error: "Informe o nome do alimento",
            })
            .min(3, { message: "O nome do alimento deve ter no minimo 3 caracteres" }),
        });

        const { food_name } = params;

        findFoodByNameSchema.parse({ food_name });

        const food = await this.findFoodByNameUseCase.execute({ food_name });

        if (food.isFailure()) {
          return {
            type: food.value.type,
            statusCode: food.value.statusCode,
            message: food.value.message,
          };
        }

        return {
          type: "OK",
          statusCode: 200,
          food: {
            ...food.value,
          },
        };
      }
    );

    this.httpServer.on(
      "post",
      [RoleMiddleware.verifyRole],
      "/foods",
      async (params: unknown, body: Food) => {
        const createFoodSchema = z.object({
          food_name: z
            .string({
              invalid_type_error: "O nome do alimento deve ser uma string",
              required_error: "Informe o nome do alimento",
            })
            .min(3, { message: "O nome do alimento deve ter no minimo 3 caracteres" }),
          price: z
            .number({
              invalid_type_error: "O preço do alimento deve ser um número",
              required_error: "Informe o preço do alimento",
            })
            .min(1, { message: "O preço do alimento não pode ser menor que R$1.00" }),
          description: z
            .string({
              invalid_type_error: "A descrição do alimento deve ser uma string",
              required_error: "Informe a descrição do alimento",
            })
            .min(10, { message: "A descrição do alimento deve ter no minimo 10 caracteres" }),
          category: z
            .string({
              invalid_type_error: "A categoria do alimento deve ser uma string",
              required_error: "Informe a categoria do alimento",
            })
            .min(3, { message: "A categoria do alimento deve ter no minimo 3 caracteres" }),
          image: z
            .string({
              invalid_type_error: "A imagem do alimento deve ser uma url",
              required_error: "Informe a imagem do alimento",
            })
            .url({ message: "A imagem do alimento deve ser uma url" }),
        });

        const { food_name, price, description, category, image } = body;

        createFoodSchema.parse({
          food_name,
          price,
          description,
          category,
          image,
        });

        const food = await this.createFoodUseCase.execute({
          food_name,
          price,
          description,
          category,
          image,
        });

        if (food.isFailure()) {
          return {
            type: food.value.type,
            statusCode: food.value.statusCode,
            message: food.value.message,
          };
        }

        return {
          type: "Created",
          statusCode: 201,
          food: {
            ...food.value,
          },
        };
      }
    );

    this.httpServer.on(
      "put",
      [RoleMiddleware.verifyRole],
      "/foods/:{id}",
      async (params: { id: string }, body: Food) => {
        const updateFoodSchema = z.object({
          id: z.string().uuid({ message: "O ID deve ser um uuid" }),
          food_name: z
            .string({
              invalid_type_error: "O nome do alimento deve ser uma string",
              required_error: "Informe o nome do alimento",
            })
            .min(3, { message: "O nome do alimento deve ter no minimo 3 caracteres" }),
          price: z
            .number({
              invalid_type_error: "O preço do alimento deve ser um número",
              required_error: "Informe o preço do alimento",
            })
            .min(1, { message: "O preço do alimento não pode ser menor que R$1.00" }),
          description: z
            .string({
              invalid_type_error: "A descrição do alimento deve ser uma string",
              required_error: "Informe a descrição do alimento",
            })
            .min(10, { message: "A descrição do alimento deve ter no minimo 10 caracteres" }),
          category: z
            .string({
              invalid_type_error: "A categoria do alimento deve ser uma string",
              required_error: "Informe a categoria do alimento",
            })
            .min(3, { message: "A categoria do alimento deve ter no minimo 3 caracteres" }),
          image: z
            .string({
              invalid_type_error: "A imagem do alimento deve ser uma url",
              required_error: "Informe a imagem do alimento",
            })
            .url({ message: "A imagem do alimento deve ser uma url" }),
        });

        const { id } = params;
        const { food_name, price, description, category, image } = body;

        updateFoodSchema.parse({
          id,
          food_name,
          price,
          description,
          category,
          image,
        });

        const food = await this.updateFoodUseCase.execute({
          id,
          food_name,
          price,
          description,
          category,
          image,
        });

        if (food.isFailure()) {
          return {
            type: food.value.type,
            statusCode: food.value.statusCode,
            message: food.value.message,
          };
        }

        return {
          type: "OK",
          statusCode: 200,
          food: {
            ...food.value,
          },
        };
      }
    );

    this.httpServer.on(
      "delete",
      [RoleMiddleware.verifyRole],
      "/foods/:{id}",
      async (params: { id: string }) => {
        const deleteFoodSchema = z.object({
          id: z.string().uuid({ message: "O ID deve ser um uuid" }),
        });

        const { id } = params;

        deleteFoodSchema.parse({ id });

        const food = await this.deleteFoodUseCase.execute({ id });

        if (food.isFailure()) {
          return {
            type: food.value.type,
            statusCode: food.value.statusCode,
            message: food.value.message,
          };
        }

        return {
          type: "OK",
          statusCode: 200,
          food: {
            ...food.value,
          },
        };
      }
    );
  }
}

export { FoodController };
