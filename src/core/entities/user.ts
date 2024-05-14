import { randomUUID } from "crypto";
import { Card } from "./card";
import { Order } from "./order";

class User {
  public cards: Card[] = [];
  public orders: Order[] = [];

  private constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string
  ) {}

  static create(name: string, email: string, password: string) {
    const id = randomUUID();

    const user = new User(id, name, email, password);

    return user;
  }
}

export { User };
