import { Delivery } from "./delivery";
import { randomUUID } from "crypto";

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

    return new Deliveryman(id, name, email, password);
  }

  static restore(id: string, name: string, email: string, password: string) {
    return new Deliveryman(id, name, email, password);
  }
}

export { Deliveryman };
