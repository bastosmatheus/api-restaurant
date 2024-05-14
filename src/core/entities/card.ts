import { randomUUID } from "crypto";

class Card {
  private constructor(
    public id: string,
    public id_client: string,
    public card_holder_name: string,
    public card_number: number,
    public card_cvv: number,
    public expiration_date: Date
  ) {}

  static create(
    id_client: string,
    card_holder_name: string,
    card_number: number,
    card_cvv: number,
    expiration_date: Date
  ) {
    const id = randomUUID();

    const card = new Card(id, id_client, card_holder_name, card_number, card_cvv, expiration_date);

    return card;
  }
}

export { Card };
