import { randomUUID } from "crypto";

class Card {
  private constructor(
    public id: string,
    public card_holder_name: string,
    public card_number: number,
    public card_cvv: number,
    public expiration_date: Date,
    public id_user: string
  ) {}

  static create(
    card_holder_name: string,
    card_number: number,
    card_cvv: number,
    expiration_date: Date,
    id_user: string
  ) {
    const id = randomUUID();

    return new Card(id, card_holder_name, card_number, card_cvv, expiration_date, id_user);
  }

  static restore(
    id: string,
    card_holder_name: string,
    card_number: number,
    card_cvv: number,
    expiration_date: Date,
    id_user: string
  ) {
    return new Card(id, card_holder_name, card_number, card_cvv, expiration_date, id_user);
  }
}

export { Card };
