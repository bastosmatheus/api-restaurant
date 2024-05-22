import { Pix } from "./pix";
import { Card } from "./card";
import { Order } from "./order";
import { randomUUID } from "crypto";

class User {
  public cards: Card[] = [];
  public orders: Order[] = [];
  public pixs: Pix[] = [];

  constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string
  ) {}

  static create(name: string, email: string, password: string) {
    const id = randomUUID();

    return new User(id, name, email, password);
  }

  static restore(id: string, name: string, email: string, password: string) {
    return new User(id, name, email, password);
  }
}

export { User };
