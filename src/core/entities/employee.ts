import { randomUUID } from "crypto";

enum EmployeeRole {
  WAITER = "Garçom",
  CHEF = "Cozinheiro",
  MANAGER = "Gerente",
}

class Employee {
  private constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string,
    public employee_role: EmployeeRole
  ) {}

  static create(name: string, email: string, password: string, employee_role: EmployeeRole) {
    const id = randomUUID();

    return new Employee(id, name, email, password, employee_role);
  }

  static restore(
    id: string,
    name: string,
    email: string,
    password: string,
    employee_role: EmployeeRole
  ) {
    return new Employee(id, name, email, password, employee_role);
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

  public getEmployeeRole() {
    return this.employee_role;
  }

  public setName(name: string) {
    this.name = name;
  }

  public setPassword(newPassword: string) {
    this.password = newPassword;
  }

  public setEmployeeRole(role: EmployeeRole) {
    this.employee_role = role;
  }
}

export { Employee, EmployeeRole };
