import { OrderFood } from "../../core/entities/order-food";
import { OrderFoodRepository } from "../../adapters/repositories/order-food-repository";
import { DatabaseConnection } from "../database/database-connection";

class OrderFoodRepositoryDatabase implements OrderFoodRepository {
  constructor(private databaseConnection: DatabaseConnection) {}

  public async findAll(): Promise<OrderFood[]> {
    const orderFood = await this.databaseConnection.query(`SELECT * FROM orders_foods`, []);

    return orderFood;
  }

  public async findByFood(id_food: string): Promise<OrderFood[]> {
    const orderFood = await this.databaseConnection.query(
      `SELECT * FROM orders_foods WHERE id_food = $1`,
      [id_food]
    );

    return orderFood;
  }

  public async findByOrder(id_order: string): Promise<OrderFood[]> {
    const orderFood = await this.databaseConnection.query(
      `SELECT * FROM orders_foods WHERE id_order = $1`,
      [id_order]
    );

    return orderFood;
  }

  public async findById(id: string): Promise<OrderFood | null> {
    const [orderFood] = await this.databaseConnection.query(
      `SELECT * FROM orders_foods WHERE id = $1`,
      [id]
    );

    if (!orderFood) {
      return null;
    }

    return OrderFood.restore(
      orderFood.id,
      orderFood.quantity,
      orderFood.id_order,
      orderFood.id_food
    );
  }

  public async create({ id, quantity, id_order, id_food }: OrderFood): Promise<OrderFood> {
    const [orderFood] = await this.databaseConnection.query(
      `
      INSERT INTO orders_foods (id, quantity, id_order, id_food)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [id, quantity, id_order, id_food]
    );

    return orderFood;
  }
}

export { OrderFoodRepositoryDatabase };
