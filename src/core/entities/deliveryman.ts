import { Delivery } from "./delivery";

class Deliveryman {
  private constructor(
    public name: string,
    public email: string,
    public password: string,
    public deliveries: Delivery[]
  ) {}

  static create(name: string, email: string, password: string) {
    const deliveryman = new Deliveryman(name, email, password, []);

    return deliveryman;
  }
}

export { Deliveryman };
