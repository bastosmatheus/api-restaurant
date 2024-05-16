import { randomUUID } from "crypto";
import { Delivery } from "./delivery";

class Deliveryman {
  public id: string;
  public deliveries: Delivery[] = [];

  private constructor(
    public name: string,
    public email: string,
    public password: string
  ) {
    this.id = randomUUID();
  }
}

export { Deliveryman };
