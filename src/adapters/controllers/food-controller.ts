import { z } from "zod";
import { Food } from "../../core/entities/food";
import { HttpServer } from "../../infraestructure/http/http-server";
import { CreateFoodUseCase } from "../../application/use-cases/food/create-food-use-case";

class FoodControler {
  constructor(
    public readonly httpServer: HttpServer,
    public readonly createFoodUseCase: CreateFoodUseCase
  ) {
    this.httpServer.on("post", "/foods", async (params: any, body: Food) => {
      const createFoodBodySchema = z.object({
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

      const createFoodBodyValidation = createFoodBodySchema.parse({
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
        type: "OK",
        statusCode: 200,
        ...food,
      };
    });
  }
}

export { FoodControler };
