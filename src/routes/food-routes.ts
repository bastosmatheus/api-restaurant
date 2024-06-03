import { HttpServer } from "../infraestructure/http/http-server";
import { FoodController } from "../adapters/controllers/food-controller";
import { DatabaseConnection } from "../infraestructure/database/database-connection";
import { FoodRepositoryDatabase } from "../infraestructure/repositories/food-repository-database";
import {
  FindAllFoodsUseCase,
  FindFoodsByCategoryUseCase,
  FindFoodByIdUseCase,
  FindFoodByNameUseCase,
  CreateFoodUseCase,
  UpdateFoodUseCase,
  DeleteFoodUseCase,
} from "../application/use-cases/food/index";

class FoodRoutes {
  private readonly foodRepository: FoodRepositoryDatabase;

  constructor(
    private readonly connection: DatabaseConnection,
    private readonly httpServer: HttpServer
  ) {
    this.foodRepository = new FoodRepositoryDatabase(this.connection);
  }

  public routes() {
    const findAllFoodsUseCase = new FindAllFoodsUseCase(this.foodRepository);
    const findFoodsByCategoryUseCase = new FindFoodsByCategoryUseCase(this.foodRepository);
    const findFoodByNameUseCase = new FindFoodByNameUseCase(this.foodRepository);
    const findFoodByIdUseCase = new FindFoodByIdUseCase(this.foodRepository);
    const createFoodUseCase = new CreateFoodUseCase(this.foodRepository);
    const updateFoodUseCase = new UpdateFoodUseCase(this.foodRepository);
    const deleteFoodUseCase = new DeleteFoodUseCase(this.foodRepository);

    return new FoodController(
      this.httpServer,
      findAllFoodsUseCase,
      findFoodsByCategoryUseCase,
      findFoodByIdUseCase,
      findFoodByNameUseCase,
      createFoodUseCase,
      updateFoodUseCase,
      deleteFoodUseCase
    );
  }
}

export { FoodRoutes };
