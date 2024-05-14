import { Food } from "../../core/entities/food";
import { HttpServer } from "../../infraestructure/http/http-server";
import { CreateFoodUseCase } from "../../application/use-cases/food/create-food-use-case";

class FoodControler {
  constructor(
    public readonly httpServer: HttpServer,
    public readonly createFoodUseCase: CreateFoodUseCase
  ) {
    this.httpServer.on("post", "/foods", async (body: Food) => {
      // const food = await this.createFoodUseCase.execute(body);

      // return food;

      console.log(body);
    });
  }
}

export { FoodControler };
