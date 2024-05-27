import { Delivery } from "./delivery";
import { randomUUID } from "crypto";

class Deliveryman {
  private constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string,
    public birthday_date: Date,
    public deliveries: Delivery[] = []
  ) {}

  static create(name: string, email: string, password: string, birthday_date: Date) {
    const id = randomUUID();

    return new Deliveryman(id, name, email, password, birthday_date);
  }

  static restore(
    id: string,
    name: string,
    email: string,
    password: string,
    birthday_date: Date,
    deliveries: Delivery[]
  ) {
    return new Deliveryman(id, name, email, password, birthday_date, deliveries);
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

  public getBirthdayDate() {
    return this.birthday_date;
  }

  public getDeliveries() {
    return this.deliveries;
  }

  public setName(name: string) {
    this.name = name;
  }

  public setPassword(password: string) {
    this.password = password;
  }

  public updateDeliveries(delivery: Delivery) {
    this.deliveries.push(delivery);
  }
}

export { Deliveryman };
