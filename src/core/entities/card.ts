class Card {
  constructor(
    public id_client: number,
    public card_holder_name: string,
    public card_number: number,
    public card_cvv: number,
    public expiration_date: Date
  ) {}
}

export { Card };
