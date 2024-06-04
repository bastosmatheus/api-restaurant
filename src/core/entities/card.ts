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

    const validDate = Card.calculateDate(new Date(expiration_date));

    if (!validDate) {
      throw new Error("O cartão está expirado");
    }

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

  private static calculateDate(expiration_date: Date) {
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    expiration_date.setHours(0, 0, 0, 0);

    return expiration_date > today;
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
