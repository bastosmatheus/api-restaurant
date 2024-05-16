import { randomUUID } from "crypto";

class Delivery {
  public id: string;

  private constructor(
    public id_deliveryman: string,
    public id_order: string
  ) {
    this.id = randomUUID();
  }
}

export { Delivery };
