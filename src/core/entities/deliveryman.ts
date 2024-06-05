import { Delivery } from "./delivery";
import { randomUUID } from "crypto";
import { BadRequestError } from "../../application/use-cases/errors/bad-request-error";

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

    const age = Deliveryman.calculateAge(new Date(birthday_date));

    if (age < 18) {
      throw new BadRequestError("Cadastro proibido para menores de 18 anos");
    }

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

  private static calculateAge(birthday_date: Date) {
    let age = new Date().getFullYear() - birthday_date.getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();

    if (
      currentMonth < birthday_date.getMonth() ||
      (currentMonth === birthday_date.getMonth() && currentDay < birthday_date.getDate())
    ) {
      age--;
    }

    return age;
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
}

export { Deliveryman };
