import { EmployeeRepository } from "../../adapters/repositories/employee-repository";
import { DatabaseConnection } from "../database/database-connection";
import { Employee, EmployeeRole } from "../../core/entities/employee";

class EmployeeRepositoryDatabase implements EmployeeRepository {
  constructor(private databaseConnection: DatabaseConnection) {}

  public async findAll(): Promise<Employee[]> {
    const employees = await this.databaseConnection.query(
      `SELECT employees.id, employees.name, employees.email, employees.employee_role FROM employees`,
      []
    );

    return employees;
  }

  public async findByRole(employee_role: EmployeeRole): Promise<Employee[]> {
    const employees = await this.databaseConnection.query(
      `SELECT employees.id, employees.name, employees.email, employees.employee_role FROM employees WHERE employee_role = $1`,
      [employee_role]
    );

    return employees;
  }

  public async findById(id: string): Promise<Employee | null> {
    const [employee] = await this.databaseConnection.query(
      `SELECT employees.id, employees.name, employees.email, employees.employee_role FROM employees WHERE id = $1`,
      [id]
    );

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
    const [employee] = await this.databaseConnection.query(
      `SELECT employees.id, employees.name, employees.email, employees.employee_role FROM employees WHERE email = $1`,
      [email]
    );

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

  public async create({ id, name, email, password, employee_role }: Employee): Promise<Employee> {
    const [employee] = await this.databaseConnection.query(
      `
      INSERT INTO employees (id, name, email, password, employee_role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [id, name, email, password, employee_role]
    );

    return employee;
  }

  public async update({ id, name, employee_role }: Employee): Promise<Employee> {
    const [employee] = await this.databaseConnection.query(
      `
        UPDATE employees
        SET name = $2, employee_role = $3
        WHERE id = $1
        RETURNING *`,
      [id, name, employee_role]
    );

    return employee;
  }

  public async updatePassword(id: string, password: string): Promise<Employee> {
    const [employee] = await this.databaseConnection.query(
      `
        UPDATE employees
        SET password = $2
        WHERE id = $1
        RETURNING *`,
      [id, password]
    );

    return employee;
  }

  public async delete(id: string): Promise<Employee> {
    const [employee] = await this.databaseConnection.query(
      `
      DELETE FROM employees 
      WHERE id = $1
      RETURNING *`,
      [id]
    );

    return employee;
  }
}

export { EmployeeRepositoryDatabase };
