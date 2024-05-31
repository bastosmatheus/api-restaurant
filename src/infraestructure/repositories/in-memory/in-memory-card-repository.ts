import { Card } from "../../../core/entities/card";
import { CardRepository } from "../../../adapters/repositories/card-repository";

class InMemoryCardRepository implements CardRepository {
  private cards: Card[] = [];

  public async findAll(): Promise<Card[]> {
    return this.cards;
  }

  public async findByUser(id_user: string): Promise<Card[]> {
    const cards = this.cards.filter((card) => card.id_user === id_user);

    return cards;
  }

  public async findById(id: string): Promise<Card | null> {
    const card = this.cards.find((card) => card.id === id);

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
    const card = this.cards.find((card) => card.card_number === card_number);

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
    card_holder_name,
    card_number,
    expiration_date,
    id_user,
  }: Card): Promise<Card> {
    const card = Card.create(card_holder_name, card_number, expiration_date, id_user);

    this.cards.push(card);

    return card;
  }

  public async delete(id: string): Promise<Card> {
    const cardIndex = this.cards.findIndex((card) => card.id === id);

    this.cards.pop();

    return this.cards[cardIndex];
  }
}

export { InMemoryCardRepository };
