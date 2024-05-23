import { Employee, EmployeeRole } from "../../core/entities/employee";

interface EmployeeRepository {
  findAll(): Promise<Employee[]>;
  findByRole(employee_role: EmployeeRole): Promise<Employee[]>;
  findById(id: string): Promise<Employee | null>;
  findByEmail(email: string): Promise<Employee | null>;
  create(employee: Employee): Promise<Employee>;
  update(employee: Employee): Promise<Employee>;
  updatePassword(id: string, newPassword: string): Promise<Employee>;
  delete(id: string): Promise<Employee>;
}

export { EmployeeRepository };
