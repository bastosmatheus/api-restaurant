class Delivery {
  private constructor(
    public id_deliveryman: number,
    public id_order: number
  ) {}

  static create(id_deliveryman: number, id_order: number) {
    const delivery = new Delivery(id_deliveryman, id_order);

    return delivery;
  }
}

export { Delivery };
