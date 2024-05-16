import { randomUUID } from "crypto";

class Employee {
  public id: string;

  private constructor(
    public name: string,
    public email: string,
    public password: string,
    public employee_function: string
  ) {
    this.id = randomUUID();
  }
}

export { Employee };
