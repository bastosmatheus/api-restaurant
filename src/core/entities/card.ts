class Card {
  private constructor(
    public id_client: number,
    public card_holder_name: string,
    public card_number: number,
    public card_cvv: number,
    public expiration_date: Date
  ) {}

  static create(
    id_client: number,
    card_holder_name: string,
    card_number: number,
    card_cvv: number,
    expiration_date: Date
  ) {
    const card = new Card(id_client, card_holder_name, card_number, card_cvv, expiration_date);

    return card;
  }
}

export { Card };
