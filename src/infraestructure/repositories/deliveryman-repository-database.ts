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
      deliverymans.birthday_date
      FROM 
        deliverymans
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
      deliverymans.birthday_date
      FROM 
        deliverymans
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
      deliverymans.birthday_date
      FROM 
        deliverymans
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
      VALUES ($1, $2, $3, $4, $5, $6)
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
