import { randomUUID } from "crypto";
import { Delivery } from "./delivery";

class Deliveryman {
  public deliveries: Delivery[] = [];

  private constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string
  ) {}

  static create(name: string, email: string, password: string) {
    const id = randomUUID();

    const deliveryman = new Deliveryman(id, name, email, password);

    return deliveryman;
  }
}

export { Deliveryman };
