import { DeliverymanRepository } from "../../adapters/repositories/deliveryman-repository";
import { Deliveryman } from "../../core/entities/deliveryman";
import { DatabaseConnection } from "../database/database-connection";

class DeliverymanRepositoryDatabase implements DeliverymanRepository {
  constructor(private databaseConnection: DatabaseConnection) {}

  public async findAll(): Promise<Deliveryman[]> {
    const deliverymans = await this.databaseConnection.query(`SELECT * FROM deliverymans`, []);

    return deliverymans;
  }

  public async findById(id: string): Promise<Deliveryman | null> {
    const [deliveryman] = await this.databaseConnection.query(
      `SELECT * FROM deliverymans WHERE id = $1`,
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
      `SELECT * FROM deliverymans WHERE email = $1`,
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
    deliveries,
  }: Deliveryman): Promise<Deliveryman> {
    const [deliveryman] = await this.databaseConnection.query(
      `
      INSERT INTO deliverymans (id, name, email, password, birthday_date deliveries)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [id, name, email, password, birthday_date, deliveries]
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
