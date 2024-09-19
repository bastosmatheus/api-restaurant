// import { PixRoutes } from "./routes/pix-routes";
// import { FoodRoutes } from "./routes/food-routes";
// import { PgpAdapter } from "./infraestructure/database/database-connection";
// import { UserRoutes } from "./routes/user-routes";
// import { CardRoutes } from "./routes/card-routes";
// import { JwtAdapter } from "./infraestructure/token/token";
// import { OrderRoutes } from "./routes/order-routes";
// import { BcryptAdapter } from "./infraestructure/cryptography/cryptography";
// import { ExpressAdapter } from "./infraestructure/http/http-server";
// import { EmployeeRoutes } from "./routes/employee-routes";
// import { DeliveryRoutes } from "./routes/delivery-routes";
// import { OrderFoodRoutes } from "./routes/order-food-routes";
// import { DeliverymanRoutes } from "./routes/deliveryman-routes";

// // adapters/banco de dados
// const httpServer = new ExpressAdapter();
// const connection = new PgpAdapter();
// const cryptography = new BcryptAdapter();
// const token = new JwtAdapter();

// // routes
// new FoodRoutes(connection, httpServer).routes();
// new EmployeeRoutes(connection, httpServer, cryptography, token).routes();
// new DeliverymanRoutes(connection, httpServer, cryptography, token).routes();
// new UserRoutes(connection, httpServer, cryptography, token).routes();
// new CardRoutes(connection, httpServer).routes();
// new PixRoutes(connection, httpServer).routes();
// new DeliveryRoutes(connection, httpServer).routes();
// new OrderRoutes(connection, httpServer).routes();
// new OrderFoodRoutes(connection, httpServer).routes();

// httpServer.listen(3000);

import express from "express";

const app = express();
app.use(express.json());

const port = 4000;

app.get("/", async (request, response) => {
  return response.send("está funcionando");
});

app.get("/books", async (request, response) => {
  return response.json({
    name: "Matheus",
  });
});

app.post("/books", async (request, response) => {
  return response.json();
});

app.listen(port, () => console.log("Server is running on port ", port));
