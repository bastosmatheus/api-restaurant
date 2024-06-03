import { PixRoutes } from "./routes/pix-routes";
import { FoodRoutes } from "./routes/food-routes";
import { PgpAdapter } from "./infraestructure/database/database-connection";
import { UserRoutes } from "./routes/user-routes";
import { CardRoutes } from "./routes/card-routes";
import { BcryptAdapter } from "./infraestructure/cryptography/cryptography";
import { ExpressAdapter } from "./infraestructure/http/http-server";
import { EmployeeRoutes } from "./routes/employee-routes";
import { DeliverymanRoutes } from "./routes/deliveryman-routes";

// adapters/banco de dados
const httpServer = new ExpressAdapter();
const connection = new PgpAdapter();
const cryptography = new BcryptAdapter();

// routes
new FoodRoutes(connection, httpServer).routes();
new EmployeeRoutes(connection, httpServer, cryptography).routes();
new DeliverymanRoutes(connection, httpServer, cryptography).routes();
new UserRoutes(connection, httpServer, cryptography).routes();
new CardRoutes(connection, httpServer).routes();
new PixRoutes(connection, httpServer).routes();

httpServer.listen(3000);
