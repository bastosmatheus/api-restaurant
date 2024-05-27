import { EmployeeRepository } from "../../../adapters/repositories/employee-repository";
import { Employee, EmployeeRole } from "../../../core/entities/employee";

class InMemoryEmployeeRepository implements EmployeeRepository {
  private employees: Employee[] = [];

  public async findAll(): Promise<Employee[]> {
    return this.employees;
  }

  public async findByRole(employee_role: EmployeeRole): Promise<Employee[]> {
    const employees = this.employees.filter((employee) => employee.employee_role === employee_role);

    return employees;
  }

  public async findById(id: string): Promise<Employee | null> {
    const employee = this.employees.find((employee) => employee.id === id);

    if (!employee) {
      return null;
    }

    return Employee.restore(
      employee.id,
      employee.name,
      employee.email,
      employee.password,
      employee.employee_role
    );
  }

  public async findByEmail(email: string): Promise<Employee | null> {
    const employee = this.employees.find((employee) => employee.email === email);

    if (!employee) {
      return null;
    }

    return Employee.restore(
      employee.id,
      employee.name,
      employee.email,
      employee.password,
      employee.employee_role
    );
  }

  public async create({ name, email, password, employee_role }: Employee): Promise<Employee> {
    const employee = Employee.create(name, email, password, employee_role);

    this.employees.push(employee);

    return employee;
  }

  public async update({ id, name, employee_role }: Employee): Promise<Employee> {
    const employeeIndex = this.employees.findIndex((employee) => employee.id === id);

    this.employees[employeeIndex].setName(name);
    this.employees[employeeIndex].setEmployeeRole(employee_role);

    return this.employees[employeeIndex];
  }

  public async updatePassword(id: string, password: string): Promise<Employee> {
    const employeeIndex = this.employees.findIndex((employee) => employee.id === id);

    this.employees[employeeIndex].setPassword(password);

    return this.employees[employeeIndex];
  }

  public async delete(id: string): Promise<Employee> {
    const employeeIndex = this.employees.findIndex((employee) => employee.id === id);

    this.employees.pop();

    return this.employees[employeeIndex];
  }
}

export { InMemoryEmployeeRepository };
