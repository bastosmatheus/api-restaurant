import { randomUUID } from "crypto";

class Employee {
  private constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string,
    public employee_function: string
  ) {}

  static create(name: string, email: string, password: string, employee_function: string) {
    const id = randomUUID();

    return new Employee(id, name, email, password, employee_function);
  }

  static restore(
    id: string,
    name: string,
    email: string,
    password: string,
    employee_function: string
  ) {
    return new Employee(id, name, email, password, employee_function);
  }
}

export { Employee };
