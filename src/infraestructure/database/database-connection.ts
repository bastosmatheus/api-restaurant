import postgres from "postgres";
import { configDotenv } from "dotenv";

const env = configDotenv();

type DatabaseConnection = {
  query<Entity extends object>(queryString: string): Promise<postgres.RowList<Entity[]>>;
};

class PostgresAdapter implements DatabaseConnection {
  public connection: postgres.Sql;

  constructor() {
    this.connection = postgres(process.env.DATABASE_URL as string);
  }

  public async query<Entity extends object>(
    queryString: string
  ): Promise<postgres.RowList<Entity[]>> {
    return await this.connection<Entity[]>/*sql*/ `
      ${queryString}
    `;
  }
}

export { DatabaseConnection, PostgresAdapter };
