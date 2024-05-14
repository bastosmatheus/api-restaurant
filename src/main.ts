import { FoodControler } from "./adapters/controllers/food-controller";
import { CreateFoodUseCase } from "./application/use-cases/food/create-food-use-case";
import { PostgresAdapter } from "./infraestructure/database/database-connection";
import { ExpressAdapter } from "./infraestructure/http/http-server";
import { FoodRepositoryDatabase } from "./infraestructure/repositories/food-repository-database";

const httpServer = new ExpressAdapter();
const connection = new PostgresAdapter();
const foodRepository = new FoodRepositoryDatabase(connection);
const createFoodUseCase = new CreateFoodUseCase(foodRepository);
new FoodControler(httpServer, createFoodUseCase);
httpServer.listen(3000);
