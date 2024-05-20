import { PgpAdapter } from "./infraestructure/database/database-connection";
import { FoodControler } from "./adapters/controllers/food-controller";
import { ExpressAdapter } from "./infraestructure/http/http-server";
import { CreateFoodUseCase } from "./application/use-cases/food/create-food-use-case";
import { UpdateFoodUseCase } from "./application/use-cases/food/update-food-use-case";
import { DeleteFoodUseCase } from "./application/use-cases/food/delete-food-use-case";
import { FindAllFoodsUseCase } from "./application/use-cases/food/find-all-foods-use-case";
import { FindFoodByIdUseCase } from "./application/use-cases/food/find-food-by-id-use-case";
import { FindFoodByNameUseCase } from "./application/use-cases/food/find-food-by-name-use-case";
import { FoodRepositoryDatabase } from "./infraestructure/repositories/food-repository-database";

// express/banco de dados
const httpServer = new ExpressAdapter();
const connection = new PgpAdapter();
const foodRepository = new FoodRepositoryDatabase(connection);
httpServer.listen(3000);

// use cases (FOOD)
const findAllFoodsUseCase = new FindAllFoodsUseCase(foodRepository);
const createFoodUseCase = new CreateFoodUseCase(foodRepository);
const findFoodByNameUseCase = new FindFoodByNameUseCase(foodRepository);
const findFoodByIdUseCase = new FindFoodByIdUseCase(foodRepository);
const updateFoodUseCase = new UpdateFoodUseCase(foodRepository);
const deleteFoodUseCase = new DeleteFoodUseCase(foodRepository);
new FoodControler(
  httpServer,
  findAllFoodsUseCase,
  findFoodByIdUseCase,
  findFoodByNameUseCase,
  createFoodUseCase,
  updateFoodUseCase,
  deleteFoodUseCase
);
