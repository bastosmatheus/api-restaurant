import { Delivery } from "../../core/entities/delivery";
import { DeliveryRepository } from "../../adapters/repositories/delivery-repository";
import { DatabaseConnection } from "../database/database-connection";

class DeliveryRepositoryDatabase implements DeliveryRepository {
  constructor(private databaseConnection: DatabaseConnection) {}

  public async findAll(): Promise<Delivery[]> {
    const deliveries = await this.databaseConnection.query(`SELECT * FROM deliveries`, []);

    return deliveries;
  }

  public async findByDeliveryman(id_deliveryman: string): Promise<Delivery[]> {
    const deliveries = await this.databaseConnection.query(
      `SELECT * FROM deliveries WHERE id_deliveryman = $1`,
      [id_deliveryman]
    );

    return deliveries;
  }

  public async findByDeliveriesNotAceppted(): Promise<Delivery[]> {
    const deliveries = await this.databaseConnection.query(
      `SELECT * FROM deliveries WHERE id_deliveryman IS NULL`,
      []
    );

    return deliveries;
  }

  public async findById(id: string): Promise<Delivery | null> {
    const [delivery] = await this.databaseConnection.query(
      `SELECT * FROM deliveries WHERE id = $1`,
      [id]
    );

    if (!delivery) {
      return null;
    }

    return Delivery.restore(
      delivery.id,
      delivery.id_order,
      delivery.id_deliveryman,
      delivery.delivery_accepted,
      delivery.delivery_completed
    );
  }

  public async create({
    id,
    id_order,
    id_deliveryman,
    delivery_accepted,
    delivery_completed,
  }: Delivery): Promise<Delivery> {
    const [delivery] = await this.databaseConnection.query(
      `
      INSERT INTO deliveries (id, id_order, id_deliveryman, delivery_accepted, delivery_completed)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [id, id_order, id_deliveryman, delivery_accepted, delivery_completed]
    );

    return delivery;
  }

  public async deliveryAccepted(
    id: string,
    id_deliveryman: string,
    dateDeliveryAccepted: Date
  ): Promise<Delivery> {
    const [delivery] = await this.databaseConnection.query(
      `
      UPDATE deliveries
      SET id_deliveryman = $2, delivery_accepted = $3
      WHERE id = $1
      RETURNING *
      `,
      [id, id_deliveryman, dateDeliveryAccepted]
    );

    return delivery;
  }

  public async deliveryCompleted(id: string, dateDeliveryCompleted: Date): Promise<Delivery> {
    const [delivery] = await this.databaseConnection.query(
      `
      UPDATE deliveries
      SET delivery_completed = $2
      WHERE id = $1
      RETURNING *
      `,
      [id, dateDeliveryCompleted]
    );

    return delivery;
  }
}

export { DeliveryRepositoryDatabase };
