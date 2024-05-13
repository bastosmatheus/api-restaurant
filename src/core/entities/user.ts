import { Card } from "./card";
import { Order } from "./order";

class User {
  public cards: Card[] = [];
  public orders: Order[] = [];

  private constructor(
    public name: string,
    public email: string,
    public password: string
  ) {}

  static create(name: string, email: string, password: string) {
    const user = new User(name, email, password);

    return user;
  }
}

export { User };
