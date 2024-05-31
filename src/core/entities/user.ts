import { Pix } from "./pix";
import { Card } from "./card";
import { Order } from "./order";
import { randomUUID } from "crypto";

class User {
  private constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string,
    public pixs: Pix[] = [],
    public cards: Card[] = [],
    public orders: Order[] = []
  ) {}

  static create(name: string, email: string, password: string) {
    const id = randomUUID();

    return new User(id, name, email, password);
  }

  static restore(
    id: string,
    name: string,
    email: string,
    password: string,
    pixs: Pix[],
    cards: Card[],
    orders: Order[]
  ) {
    return new User(id, name, email, password, pixs, cards, orders);
  }

  public getId() {
    return this.id;
  }

  public getName() {
    return this.name;
  }

  public getEmail() {
    return this.email;
  }

  public getPassword() {
    return this.password;
  }

  public getPixs() {
    return this.pixs;
  }

  public getCards() {
    return this.cards;
  }

  public getOrders() {
    return this.orders;
  }

  public setName(name: string) {
    this.name = name;
  }

  public setPassword(password: string) {
    this.password = password;
  }

  public addPixs(pix: Pix) {
    this.pixs.push(pix);
  }

  public addCards(card: Card) {
    this.cards.push(card);
  }

  public addOrders(order: Order) {
    this.orders.push(order);
  }
}

export { User };
