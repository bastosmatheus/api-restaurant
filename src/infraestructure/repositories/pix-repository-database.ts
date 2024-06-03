import { PixRepository } from "../../adapters/repositories/pix-repository";
import { Pix, StatusPix } from "../../core/entities/pix";
import { DatabaseConnection } from "../database/database-connection";

class PixRepositoryDatabase implements PixRepository {
  constructor(private databaseConnection: DatabaseConnection) {}

  public async findAll(): Promise<Pix[]> {
    const pixs = await this.databaseConnection.query(`SELECT * FROM pixs`, []);

    return pixs;
  }

  public async findByUser(id_user: string): Promise<Pix[]> {
    const pixs = await this.databaseConnection.query(`SELECT * FROM pixs WHERE id_user = $1`, [
      id_user,
    ]);

    return pixs;
  }

  public async findByStatus(status: StatusPix): Promise<Pix[]> {
    const pixs = await this.databaseConnection.query(`SELECT * FROM pixs WHERE status = $1`, [
      status,
    ]);

    return pixs;
  }

  public async findById(id: string): Promise<Pix | null> {
    const [pix] = await this.databaseConnection.query(`SELECT * FROM pixs WHERE id = $1`, [id]);

    if (!pix) {
      return null;
    }

    return Pix.restore(pix.id, pix.code, pix.time_pix_generated, pix.id_user, pix.status);
  }

  public async findByCode(code: string): Promise<Pix | null> {
    const [pix] = await this.databaseConnection.query(`SELECT * FROM pixs WHERE code = $1`, [code]);

    if (!pix) {
      return null;
    }

    return Pix.restore(pix.id, pix.code, pix.time_pix_generated, pix.id_user, pix.status);
  }

  public async create({ id, code, time_pix_generated, id_user, status }: Pix): Promise<Pix> {
    const [pix] = await this.databaseConnection.query(
      `
      INSERT INTO pixs (id, code, time_pix_generated, id_user, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [id, code, time_pix_generated, id_user, status]
    );

    return pix;
  }

  public async updateStatus(id: string, status: "Pago" | "Expirado"): Promise<Pix> {
    const [pix] = await this.databaseConnection.query(
      `
      UPDATE pixs
      SET status = $2
      WHERE id = $1
      RETURNING *
      `,
      [id, status]
    );

    return pix;
  }
}

export { PixRepositoryDatabase };
