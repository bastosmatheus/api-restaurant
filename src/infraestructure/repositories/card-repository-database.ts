import { Card } from "../../core/entities/card";
import { CardRepository } from "../../adapters/repositories/card-repository";
import { DatabaseConnection } from "../database/database-connection";

class CardRepositoryDatabase implements CardRepository {
  constructor(private databaseConnection: DatabaseConnection) {}

  public async findAll(): Promise<Card[]> {
    const cards = await this.databaseConnection.query(`SELECT * FROM cards`, []);

    return cards;
  }

  public async findByUser(id_user: string): Promise<Card[]> {
    const cards = await this.databaseConnection.query(`SELECT * FROM cards WHERE id_user = $1`, [
      id_user,
    ]);

    return cards;
  }

  public async findById(id: string): Promise<Card | null> {
    const [card] = await this.databaseConnection.query(`SELECT * FROM cards WHERE id = $1`, [id]);

    if (!card) {
      return null;
    }

    return Card.restore(
      card.id,
      card.card_holder_name,
      card.card_number,
      card.expiration_date,
      card.id_user
    );
  }

  public async findByCardNumber(card_number: string): Promise<Card | null> {
    const [card] = await this.databaseConnection.query(
      `SELECT * FROM cards WHERE card_number = $1`,
      [card_number]
    );

    if (!card) {
      return null;
    }

    return Card.restore(
      card.id,
      card.card_holder_name,
      card.card_number,
      card.expiration_date,
      card.id_user
    );
  }

  public async create({
    id,
    card_holder_name,
    card_number,
    expiration_date,
    id_user,
  }: Card): Promise<Card> {
    const [card] = await this.databaseConnection.query(
      `
      INSERT INTO cards (id, card_holder_name, card_number, expiration_date, id_user)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [id, card_holder_name, card_number, expiration_date, id_user]
    );

    return card;
  }

  public async delete(id: string): Promise<Card> {
    const [card] = await this.databaseConnection.query(
      `
      DELETE FROM cards
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    return card;
  }
}

export { CardRepositoryDatabase };
