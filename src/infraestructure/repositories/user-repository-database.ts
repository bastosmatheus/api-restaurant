import { User } from "../../core/entities/user";
import { UserRepository } from "../../adapters/repositories/user-repository";
import { DatabaseConnection } from "../database/database-connection";

class UserRepositoryDatabase implements UserRepository {
  constructor(private databaseConnection: DatabaseConnection) {}

  public async findAll(): Promise<User[]> {
    const users = await this.databaseConnection.query(
      `
      SELECT
      users.id,
      users.name,
      users.email,
      COALESCE(
          (
            SELECT JSON_AGG(
                JSON_BUILD_OBJECT(
                  'id', cards.id,
                  'card_holder_name', cards.card_holder_name,
                  'card_number', cards.card_number,
                  'expiration_date', cards.expiration_date
                )
            )
            FROM cards
            WHERE cards.id_user = users.id
        ), '[]'
      ) AS cards,
      COALESCE(
          (
            SELECT JSON_AGG(
                JSON_BUILD_OBJECT(
                  'id', pixs.id,
                  'code', pixs.code,
                  'time_pix_generated', pixs.time_pix_generated,
                  'status', pixs.status
                )
            )
            FROM pixs
            WHERE pixs.id_user = users.id
        ), '[]'
      ) AS pixs,
      COALESCE(
          (
            SELECT JSON_AGG(
                JSON_BUILD_OBJECT(
                  'id', orders.id,
                  'id_user', orders.id_user,
                  'id_pix', orders.id_pix,
                  'id_card', orders.id_card,
                  'amount', orders.amount,
                  'status', orders.status
                )
            )
            FROM orders
            WHERE orders.id_user = users.id
        ), '[]'
    ) AS orders
    FROM
        users
      `,
      []
    );

    return users;
  }

  public async findById(id: string): Promise<User | null> {
    const [user] = await this.databaseConnection.query(
      `
      SELECT
      users.id,
      users.name,
      users.email,
      users.password,
      COALESCE(
          (
            SELECT JSON_AGG(
                JSON_BUILD_OBJECT(
                  'id', cards.id,
                  'card_holder_name', cards.card_holder_name,
                  'card_number', cards.card_number,
                  'expiration_date', cards.expiration_date
                )
            )
            FROM cards
            WHERE cards.id_user = users.id
        ), '[]'
      ) AS cards,
      COALESCE(
          (
            SELECT JSON_AGG(
                JSON_BUILD_OBJECT(
                  'id', pixs.id,
                  'code', pixs.code,
                  'time_pix_generated', pixs.time_pix_generated,
                  'status', pixs.status
                )
            )
            FROM pixs
            WHERE pixs.id_user = users.id
        ), '[]'
      ) AS pixs,
      COALESCE(
          (
            SELECT JSON_AGG(
                JSON_BUILD_OBJECT(
                  'id', orders.id,
                  'id_user', orders.id_user,
                  'id_pix', orders.id_pix,
                  'id_card', orders.id_card,
                  'amount', orders.amount,
                  'status', orders.status
                )
            )
            FROM orders
            WHERE orders.id_user = users.id
        ), '[]'
      ) AS orders
      FROM
        users
      WHERE users.id = $1
      `,
      [id]
    );

    if (!user) {
      return null;
    }

    return User.restore(
      user.id,
      user.name,
      user.email,
      user.password,
      user.pixs,
      user.cards,
      user.orders
    );
  }

  public async findByEmail(email: string): Promise<User | null> {
    const [user] = await this.databaseConnection.query(
      `
      SELECT
      users.id,
      users.name,
      users.email,
      users.password,
      COALESCE(
          (
            SELECT JSON_AGG(
                JSON_BUILD_OBJECT(
                  'id', cards.id,
                  'card_holder_name', cards.card_holder_name,
                  'card_number', cards.card_number,
                  'expiration_date', cards.expiration_date
                )
            )
            FROM cards
            WHERE cards.id_user = users.id
        ), '[]'
      ) AS cards,
      COALESCE(
          (
            SELECT JSON_AGG(
                JSON_BUILD_OBJECT(
                  'id', pixs.id,
                  'code', pixs.code,
                  'time_pix_generated', pixs.time_pix_generated,
                  'status', pixs.status
                )
            )
            FROM pixs
            WHERE pixs.id_user = users.id
        ), '[]'
      ) AS pixs,
      COALESCE(
          (
            SELECT JSON_AGG(
                JSON_BUILD_OBJECT(
                  'id', orders.id,
                  'id_user', orders.id_user,
                  'id_pix', orders.id_pix,
                  'id_card', orders.id_card,
                  'amount', orders.amount,
                  'status', orders.status
                )
            )
            FROM orders
            WHERE orders.id_user = users.id
        ), '[]'
      ) AS orders
      FROM
        users
      WHERE users.email = $1
      `,
      [email]
    );

    if (!user) {
      return null;
    }

    return User.restore(
      user.id,
      user.name,
      user.email,
      user.password,
      user.pixs,
      user.cards,
      user.orders
    );
  }

  public async create({ id, name, email, password }: User): Promise<User> {
    const [user] = await this.databaseConnection.query(
      `
      INSERT INTO users (id, name, email, password)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [id, name, email, password]
    );

    return user;
  }

  public async update({ id, name }: User): Promise<User> {
    const [user] = await this.databaseConnection.query(
      `
      UPDATE users
      SET name = $2
      WHERE id = $1
      RETURNING *`,
      [id, name]
    );

    return user;
  }

  public async updatePasword(id: string, password: string): Promise<User> {
    const [user] = await this.databaseConnection.query(
      `
        UPDATE users
        SET password = $2
        WHERE id = $1
        RETURNING *`,
      [id, password]
    );

    return user;
  }

  public async delete(id: string): Promise<User> {
    const [user] = await this.databaseConnection.query(
      `
      DELETE FROM users
      WHERE id = $1
      RETURNING *`,
      [id]
    );

    return user;
  }
}

export { UserRepositoryDatabase };
