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
        JSON_AGG(
          JSON_BUILD_OBJECT(
              'id', cards.id,
              'card_holder_name', cards.card_holder_name,
              'card_number', cards.card_number,
              'expiration_date', cards.expiration_date
          )
      ) FILTER (WHERE cards.id IS NOT NULL), '[]' ) AS cards
      FROM
        users
      LEFT JOIN
        cards ON users.id = cards.id_user
      GROUP BY
        users.id;
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
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
              'id', cards.id,
              'card_holder_name', cards.card_holder_name,
              'card_number', cards.card_number,
              'expiration_date', cards.expiration_date
          )
      ) FILTER (WHERE cards.id IS NOT NULL), '[]' ) AS cards
      FROM
        users
      LEFT JOIN
        cards ON users.id = cards.id_user
      WHERE users.id = $1
      GROUP BY
        users.id;
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
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
              'id', cards.id,
              'card_holder_name', cards.card_holder_name,
              'card_number', cards.card_number,
              'expiration_date', cards.expiration_date
          )
      ) FILTER (WHERE cards.id IS NOT NULL), '[]' ) AS cards
      FROM
        users
      LEFT JOIN
        cards ON users.id = cards.id_user
      WHERE users.email = $1
      GROUP BY
        users.id
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
