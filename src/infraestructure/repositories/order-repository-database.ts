import { OrderRepository } from "../../adapters/repositories/order-repository";
import { Order, StatusOrder } from "../../core/entities/order";
import { DatabaseConnection } from "../database/database-connection";

class OrderRepositoryDatabase implements OrderRepository {
  constructor(private databaseConnection: DatabaseConnection) {}

  public async findAll(): Promise<Order[]> {
    const orders = await this.databaseConnection.query(
      `
      SELECT  
      orders.id,
      orders.id_user,
      orders.id_pix,
      orders.id_card,
      orders.amount,
      orders.status,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
              'id', orders_foods.id,
              'id_order', orders_foods.id_order,
              'id_food', orders_foods.id
          )
      ) FILTER (WHERE orders_foods.id IS NOT NULL), '[]' ) AS orders_foods
      FROM 
        orders
      LEFT JOIN
        orders_foods ON orders.id = orders_foods.id_order
      GROUP BY
        orders.id
      `,
      []
    );

    return orders;
  }

  public async findByCards(): Promise<Order[]> {
    const orders = await this.databaseConnection.query(
      `
      SELECT  
      orders.id,
      orders.id_user,
      orders.id_pix,
      orders.id_card,
      orders.amount,
      orders.status,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
              'id', orders_foods.id,
              'id_order', orders_foods.id_order,
              'id_food', orders_foods.id
          )
      ) FILTER (WHERE orders_foods.id IS NOT NULL), '[]' ) AS orders_foods
      FROM 
        orders
      LEFT JOIN
        orders_foods ON orders.id = orders_foods.id_order
      WHERE id_card IS NOT NULL
      GROUP BY
        orders.id
      `,
      []
    );

    return orders;
  }

  public async findByPixs(): Promise<Order[]> {
    const orders = await this.databaseConnection.query(
      `
      SELECT  
      orders.id,
      orders.id_user,
      orders.id_pix,
      orders.id_card,
      orders.amount,
      orders.status,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
              'id', orders_foods.id,
              'id_order', orders_foods.id_order,
              'id_food', orders_foods.id
          )
      ) FILTER (WHERE orders_foods.id IS NOT NULL), '[]' ) AS orders_foods
      FROM 
        orders
      LEFT JOIN
        orders_foods ON orders.id = orders_foods.id_order
      WHERE id_pix IS NOT NULL
      GROUP BY
        orders.id
      `,
      []
    );

    return orders;
  }

  public async findByCard(id_card: string): Promise<Order[]> {
    const orders = await this.databaseConnection.query(
      `
      SELECT  
      orders.id,
      orders.id_user,
      orders.id_pix,
      orders.id_card,
      orders.amount,
      orders.status,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
              'id', orders_foods.id,
              'id_order', orders_foods.id_order,
              'id_food', orders_foods.id
          )
      ) FILTER (WHERE orders_foods.id IS NOT NULL), '[]' ) AS orders_foods
      FROM 
        orders
      LEFT JOIN
        orders_foods ON orders.id = orders_foods.id_order
      WHERE id_card = $1
      GROUP BY
        orders.id
      `,
      [id_card]
    );

    return orders;
  }

  public async findByUser(id_user: string): Promise<Order[]> {
    const orders = await this.databaseConnection.query(
      `
      SELECT  
      orders.id,
      orders.id_user,
      orders.id_pix,
      orders.id_card,
      orders.amount,
      orders.status,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
              'id', orders_foods.id,
              'id_order', orders_foods.id_order,
              'id_food', orders_foods.id
          )
      ) FILTER (WHERE orders_foods.id IS NOT NULL), '[]' ) AS orders_foods
      FROM 
        orders
      LEFT JOIN
        orders_foods ON orders.id = orders_foods.id_order
      WHERE id_user = $1
      GROUP BY
        orders.id
      `,
      [id_user]
    );

    return orders;
  }

  public async findByStatus(status: StatusOrder): Promise<Order[]> {
    const orders = await this.databaseConnection.query(
      `
      SELECT  
      orders.id,
      orders.id_user,
      orders.id_pix,
      orders.id_card,
      orders.amount,
      orders.status,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
              'id', orders_foods.id,
              'id_order', orders_foods.id_order,
              'id_food', orders_foods.id
          )
      ) FILTER (WHERE orders_foods.id IS NOT NULL), '[]' ) AS orders_foods
      FROM 
        orders
      LEFT JOIN
        orders_foods ON orders.id = orders_foods.id_order
      WHERE status = $1
      GROUP BY
        orders.id
      `,
      [status]
    );

    return orders;
  }

  public async findById(id: string): Promise<Order | null> {
    const [order] = await this.databaseConnection.query(
      `
      SELECT  
      orders.id,
      orders.id_user,
      orders.id_pix,
      orders.id_card,
      orders.amount,
      orders.status,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
              'id', orders_foods.id,
              'id_order', orders_foods.id_order,
              'id_food', orders_foods.id
          )
      ) FILTER (WHERE orders_foods.id IS NOT NULL), '[]' ) AS orders_foods
      FROM 
        orders
      LEFT JOIN
        orders_foods ON orders.id = orders_foods.id_order
      WHERE orders.id = $1
      GROUP BY
        orders.id
      `,
      [id]
    );

    if (!order) {
      return null;
    }

    return Order.restore(
      order.id,
      order.id_user,
      order.id_pix,
      order.id_card,
      order.amount,
      order.status,
      order.orders_foods
    );
  }

  public async create({ id, id_user, id_pix, id_card, amount, status }: Order): Promise<Order> {
    const [order] = await this.databaseConnection.query(
      `
      INSERT INTO orders (id, id_user, id_pix, id_card, amount, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [id, id_user, id_pix, id_card, amount, status]
    );

    return order;
  }

  public async updateStatus(id: string, status: StatusOrder): Promise<Order> {
    const [order] = await this.databaseConnection.query(
      `
      UPDATE orders
      SET status = $2
      WHERE id = $1
      RETURNING *
      `,
      [id, status]
    );

    return order;
  }
}

export { OrderRepositoryDatabase };
