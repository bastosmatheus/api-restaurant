import { randomUUID } from "crypto";

class Card {
  private constructor(
    public id: string,
    public card_holder_name: string,
    public card_number: string,
    public expiration_date: Date,
    public id_user: string
  ) {}

  static create(
    card_holder_name: string,
    card_number: string,
    expiration_date: Date,
    id_user: string
  ) {
    const id = randomUUID();

    return new Card(id, card_holder_name, card_number, expiration_date, id_user);
  }

  static restore(
    id: string,
    card_holder_name: string,
    card_number: string,
    expiration_date: Date,
    id_user: string
  ) {
    return new Card(id, card_holder_name, card_number, expiration_date, id_user);
  }

  public getId() {
    return this.id;
  }

  public getCardHolderName() {
    return this.card_holder_name;
  }

  public getCardNumber() {
    return this.card_number;
  }

  public getExpirationDate() {
    return this.expiration_date;
  }
}

export { Card };
