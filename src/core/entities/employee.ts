class Employee {
  private constructor(
    public name: string,
    public email: string,
    public password: string,
    public employee_function: string
  ) {}

  static create(name: string, email: string, password: string, employee_function?: string) {
    const employee = new Employee(name, email, password, employee_function || "employee");

    return employee;
  }
}

export { Employee };
