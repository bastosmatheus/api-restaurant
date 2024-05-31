import { Card } from "../../core/entities/card";

interface CardRepository {
  findAll(): Promise<Card[]>;
  findByUser(id_user: string): Promise<Card[]>;
  findById(id: string): Promise<Card | null>;
  findByCardNumber(card_number: string): Promise<Card | null>;
  create(card: Card): Promise<Card>;
  delete(id: string): Promise<Card>;
}

export { CardRepository };
