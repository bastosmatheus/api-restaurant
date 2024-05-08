import { Delivery } from "./delivery";

class Deliveryman {
  constructor(
    public name: string,
    public email: string,
    public password: string,
    public deliveries: Delivery
  ) {}
}

export { Deliveryman };
