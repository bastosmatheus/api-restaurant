import pgp from "pg-promise";
import pg from "pg-promise/typescript/pg-subset";
import { configDotenv } from "dotenv";

const env = configDotenv();

interface DatabaseConnection {
  query(queryString: string, params: unknown[]): Promise<any>;
}

class PgpAdapter implements DatabaseConnection {
  private connection: pgp.IDatabase<{}, pg.IClient>;

  constructor() {
    this.connection = pgp()(process.env.DATABASE_URL as string);
  }

  public async query(queryString: string, params: unknown[]): Promise<any> {
    const query = await this.connection.query(queryString, params);

    return query;
  }
}

export { DatabaseConnection, PgpAdapter };
