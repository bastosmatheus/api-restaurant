import { randomUUID } from "crypto";

class Delivery {
  private constructor(
    public id: string,
    public id_deliveryman: string,
    public id_order: string
  ) {}

  static create(id_deliveryman: string, id_order: string) {
    const id = randomUUID();

    const delivery = new Delivery(id, id_deliveryman, id_order);

    return delivery;
  }
}

export { Delivery };
