import { randomUUID } from "crypto";

class Card {
  public id: string;

  private constructor(
    public id_client: string,
    public card_holder_name: string,
    public card_number: number,
    public card_cvv: number,
    public expiration_date: Date
  ) {
    this.id = randomUUID();
  }
}

export { Card };
