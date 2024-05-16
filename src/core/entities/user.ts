import { randomUUID } from "crypto";
import { Card } from "./card";
import { Order } from "./order";

class User {
  public id: string;
  public cards: Card[] = [];
  public orders: Order[] = [];

  private constructor(
    public name: string,
    public email: string,
    public password: string
  ) {
    this.id = randomUUID();
  }
}

export { User };
