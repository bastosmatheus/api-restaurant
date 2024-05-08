import { Card } from "./card";
import { Order } from "./order";

class User {
  constructor(
    public name: string,
    public email: string,
    public password: string,
    public cards: Card[],
    public orders: Order[]
  ) {}
}

export { User };
