import { Deliveryman } from "../../core/entities/deliveryman";
import { DatabaseConnection } from "../database/database-connection";
import { DeliverymanRepository } from "../../adapters/repositories/deliveryman-repository";

class DeliverymanRepositoryDatabase implements DeliverymanRepository {
  constructor(private databaseConnection: DatabaseConnection) {}

  public async findAll(): Promise<Deliveryman[]> {
    const deliverymans = await this.databaseConnection.query(
      `
      SELECT 
      deliverymans.id,
      deliverymans.name,
      deliverymans.email,
      deliverymans.birthday_date,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', deliveries.id,
            'id_order', deliveries.id_order,
            'delivery_accepted', deliveries.delivery_accepted,
            'delivery_completed', deliveries.delivery_completed
          )
        ) FILTER (WHERE deliveries.id IS NOT NULL), '[]' ) AS deliveries
      FROM 
        deliverymans
      LEFT JOIN
        deliveries ON deliverymans.id = deliveries.id_deliveryman
      GROUP BY
        deliverymans.id
      `,
      []
    );

    return deliverymans;
  }

  public async findById(id: string): Promise<Deliveryman | null> {
    const [deliveryman] = await this.databaseConnection.query(
      `
      SELECT 
      deliverymans.id,
      deliverymans.name,
      deliverymans.email,
      deliverymans.password,
      deliverymans.birthday_date,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', deliveries.id,
            'id_order', deliveries.id_order,
            'delivery_accepted', deliveries.delivery_accepted,
            'delivery_completed', deliveries.delivery_completed
          )
        ) FILTER (WHERE deliveries.id IS NOT NULL), '[]' ) AS deliveries
      FROM 
        deliverymans
      LEFT JOIN
        deliveries ON deliverymans.id = deliveries.id_deliveryman
      WHERE deliverymans.id = $1
      GROUP BY
        deliverymans.id
      `,
      [id]
    );

    if (!deliveryman) {
      return null;
    }

    return Deliveryman.restore(
      deliveryman.id,
      deliveryman.name,
      deliveryman.email,
      deliveryman.password,
      deliveryman.birthday_date,
      deliveryman.deliveries
    );
  }

  public async findByEmail(email: string): Promise<Deliveryman | null> {
    const [deliveryman] = await this.databaseConnection.query(
      `
      SELECT 
      deliverymans.id,
      deliverymans.name,
      deliverymans.email,
      deliverymans.password,
      deliverymans.birthday_date,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', deliveries.id,
            'id_order', deliveries.id_order,
            'delivery_accepted', deliveries.delivery_accepted,
            'delivery_completed', deliveries.delivery_completed
          )
        ) FILTER (WHERE deliveries.id IS NOT NULL), '[]' ) AS deliveries
      FROM 
        deliverymans
      LEFT JOIN
        deliveries ON deliverymans.id = deliveries.id_deliveryman
      WHERE deliverymans.email = $1
      GROUP BY
        deliverymans.id
      `,
      [email]
    );

    if (!deliveryman) {
      return null;
    }

    return Deliveryman.restore(
      deliveryman.id,
      deliveryman.name,
      deliveryman.email,
      deliveryman.password,
      deliveryman.birthday_date,
      deliveryman.deliveries
    );
  }

  public async create({
    id,
    name,
    email,
    password,
    birthday_date,
  }: Deliveryman): Promise<Deliveryman> {
    const [deliveryman] = await this.databaseConnection.query(
      `
      INSERT INTO deliverymans (id, name, email, password, birthday_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [id, name, email, password, birthday_date]
    );

    return deliveryman;
  }

  public async update({ id, name }: Deliveryman): Promise<Deliveryman> {
    const [deliveryman] = await this.databaseConnection.query(
      `
      UPDATE deliverymans
      SET name = $2
      WHERE id = $1
      RETURNING *`,
      [id, name]
    );

    return deliveryman;
  }

  public async updatePassword(id: string, password: string): Promise<Deliveryman> {
    const [deliverymans] = await this.databaseConnection.query(
      `
      UPDATE deliverymans
      SET password = $2
      WHERE id = $1
      RETURNING *`,
      [id, password]
    );

    return deliverymans;
  }

  public async delete(id: string): Promise<Deliveryman> {
    const [deliveryman] = await this.databaseConnection.query(
      `
      DELETE FROM deliverymans 
      WHERE id = $1
      RETURNING *`,
      [id]
    );

    return deliveryman;
  }
}

export { DeliverymanRepositoryDatabase };
