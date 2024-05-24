import { z } from "zod";
import { HttpServer } from "../../infraestructure/http/http-server";
import { CreateEmployeeUseCase } from "../../application/use-cases/employee/create-employee-use-case";
import { DeleteEmployeeUseCase } from "../../application/use-cases/employee/delete-employee-use-case";
import { UpdateEmployeeUseCase } from "../../application/use-cases/employee/update-employee-use-case";
import { UpdatePasswordUseCase } from "../../application/use-cases/employee/update-password-use-case";
import { Employee, EmployeeRole } from "../../core/entities/employee";
import { FindAllEmployeesUseCase } from "../../application/use-cases/employee/find-all-employees-use-case";
import { FindEmployeeByIdUseCase } from "../../application/use-cases/employee/find-employee-by-id-use-case";
import { FindEmployeeByEmailUseCase } from "../../application/use-cases/employee/find-employee-by-email-use-case";
import { FindEmployeesByRoleUseCase } from "../../application/use-cases/employee/find-employees-by-role-use-case";

class EmployeeController {
  constructor(
    private readonly httpServer: HttpServer,
    private readonly findAllEmployeesUseCase: FindAllEmployeesUseCase,
    private readonly findEmployeesByRoleUseCase: FindEmployeesByRoleUseCase,
    private readonly findEmployeeByIdUseCase: FindEmployeeByIdUseCase,
    private readonly findEmployeeByEmailUseCase: FindEmployeeByEmailUseCase,
    private readonly createEmployeeUseCase: CreateEmployeeUseCase,
    private readonly updateEmployeeUseCase: UpdateEmployeeUseCase,
    private readonly updatePasswordUseCase: UpdatePasswordUseCase,
    private readonly deleteEmployeeUseCase: DeleteEmployeeUseCase
  ) {
    this.httpServer.on("get", "/employees", async () => {
      const employees = await this.findAllEmployeesUseCase.execute();

      return {
        type: "OK",
        statusCode: 200,
        employees,
      };
    });

    this.httpServer.on(
      "get",
      "/employees/role/:{employee_role}",
      async (params: { employee_role: EmployeeRole }, body: unknown) => {
        const getAllEmployeesByRoleSchema = z.object({
          employee_role: z.enum(["Cozinheiro", "Garçom", "Gerente"], {
            errorMap: (status, ctx) => {
              if (status.code === "invalid_enum_value") {
                return {
                  message: "Informe um tipo válido de função: Cozinheiro, Garçom ou Gerente",
                };
              }

              if (status.code === "invalid_type" && status.received === "undefined") {
                return {
                  message: "Informe a função do funcionário",
                };
              }

              if (status.code === "invalid_type" && status.received !== "string") {
                return {
                  message: "A função do funcionário deve ser uma string",
                };
              }
            },
          }),
        });

        const { employee_role } = params;

        const getAllEmployeesByRoleValidation = getAllEmployeesByRoleSchema.parse({
          employee_role,
        });

        const employees = await this.findEmployeesByRoleUseCase.execute({ employee_role });

        return {
          type: "OK",
          statusCode: 200,
          employees,
        };
      }
    );

    this.httpServer.on("get", "/employees/:{id}", async (params: { id: string }, body: unknown) => {
      const getEmployeeByIdSchema = z.object({
        id: z.string().uuid({
          message: "O ID deve ser um uuid",
        }),
      });

      const { id } = params;

      const getEmployeeByIdValidation = getEmployeeByIdSchema.parse({ id });

      const employee = await this.findEmployeeByIdUseCase.execute({ id });

      if (employee.isFailure()) {
        return {
          type: employee.value.type,
          statusCode: employee.value.statusCode,
          message: employee.value.message,
        };
      }

      return {
        type: "OK",
        statusCode: 200,
        employee: {
          ...employee.value,
        },
      };
    });

    this.httpServer.on(
      "get",
      "/employees/email/:{email}",
      async (params: { email: string }, body: unknown) => {
        const getEmployeeByEmailSchema = z.object({
          email: z
            .string({
              invalid_type_error: "O email do funcionário deve ser uma string",
              required_error: "Informe o email do funcionário",
            })
            .email({ message: "Email inválido" }),
        });

        const { email } = params;

        const getEmployeeByEmailValidation = getEmployeeByEmailSchema.parse({ email });

        const employee = await this.findEmployeeByEmailUseCase.execute({ email });

        if (employee.isFailure()) {
          return {
            type: employee.value.type,
            statusCode: employee.value.statusCode,
            message: employee.value.message,
          };
        }

        return {
          type: "OK",
          statusCode: 200,
          employee: {
            ...employee.value,
          },
        };
      }
    );

    this.httpServer.on("post", "/employees", async (params: unknown, body: Employee) => {
      const createEmployeeSchema = z.object({
        name: z
          .string({
            invalid_type_error: "O nome do funcionário deve ser uma string",
            required_error: "Informe o nome do funcionário",
          })
          .min(3, { message: "O nome do funcionário deve ter no minimo 3 caracteres" }),
        email: z
          .string({
            invalid_type_error: "O email do funcionário deve ser uma string",
            required_error: "Informe o email do funcionário",
          })
          .email({ message: "Email inválido" }),
        password: z
          .string({
            required_error: "Informe a senha do funcionário",
            invalid_type_error: "A senha do funcionário deve ser uma string",
          })
          .min(5, { message: "A senha deve ter no mínimo 5 caracteres" }),
        employee_role: z.enum(["Cozinheiro", "Garçom", "Gerente"], {
          errorMap: (status, ctx) => {
            if (status.code === "invalid_enum_value") {
              return {
                message: "Informe um tipo válido de função: Cozinheiro, Garçom ou Gerente",
              };
            }

            if (status.code === "invalid_type" && status.received === "undefined") {
              return {
                message: "Informe a função do funcionário",
              };
            }

            if (status.code === "invalid_type" && status.received !== "string") {
              return {
                message: "A função do funcionário deve ser uma string",
              };
            }
          },
        }),
      });

      const { name, email, password, employee_role } = body;

      const createEmployeeValidation = createEmployeeSchema.parse({
        name,
        email,
        password,
        employee_role,
      });

      const employee = await this.createEmployeeUseCase.execute({
        name,
        email,
        password,
        employee_role,
      });

      if (employee.isFailure()) {
        return {
          type: employee.value.type,
          statusCode: employee.value.statusCode,
          message: employee.value.message,
        };
      }

      return {
        type: "Created",
        statusCode: 201,
        employee: {
          ...employee.value,
        },
      };
    });

    this.httpServer.on(
      "put",
      "/employees/:{id}",
      async (params: { id: string }, body: Employee) => {
        const updateEmployeeSchema = z.object({
          id: z.string().uuid({
            message: "O ID deve ser um uuid",
          }),
          name: z
            .string({
              invalid_type_error: "O nome do funcionário deve ser uma string",
              required_error: "Informe o nome do funcionário",
            })
            .min(3, { message: "O nome do funcionário deve ter no minimo 3 caracteres" }),
          employee_role: z.enum(["Cozinheiro", "Garçom", "Gerente"], {
            errorMap: (status, ctx) => {
              if (status.code === "invalid_enum_value") {
                return {
                  message: "Informe um tipo válido de função: Cozinheiro, Garçom ou Gerente",
                };
              }

              if (status.code === "invalid_type" && status.received === "undefined") {
                return {
                  message: "Informe a função do funcionário",
                };
              }

              if (status.code === "invalid_type" && status.received !== "string") {
                return {
                  message: "A função do funcionário deve ser uma string",
                };
              }
            },
          }),
        });

        const { id } = params;
        const { name, employee_role } = body;

        const updateEmployeeValidation = updateEmployeeSchema.parse({
          id,
          name,
          employee_role,
        });

        const employee = await this.updateEmployeeUseCase.execute({
          id,
          name,
          employee_role,
        });

        if (employee.isFailure()) {
          return {
            type: employee.value.type,
            statusCode: employee.value.statusCode,
            message: employee.value.message,
          };
        }

        return {
          type: "OK",
          statusCode: 200,
          employee: {
            ...employee.value,
          },
        };
      }
    );

    this.httpServer.on(
      "patch",
      "/employees/:{id}",
      async (params: { id: string }, body: Employee) => {
        const updatePasswordSchema = z.object({
          id: z.string().uuid({
            message: "O ID deve ser um uuid",
          }),
          password: z
            .string({
              required_error: "Informe a nova senha",
              invalid_type_error: "A senha deve ser uma string",
            })
            .min(5, { message: "A senha deve ter no mínimo 5 caracteres" }),
        });

        const { id } = params;
        const { password } = body;

        const updatePasswordValidation = updatePasswordSchema.parse({
          id,
          password,
        });

        const employee = await this.updatePasswordUseCase.execute({
          id,
          password,
        });

        if (employee.isFailure()) {
          return {
            type: employee.value.type,
            statusCode: employee.value.statusCode,
            message: employee.value.message,
          };
        }

        return {
          type: "OK",
          statusCode: 200,
          employee: {
            ...employee.value,
          },
        };
      }
    );

    this.httpServer.on(
      "delete",
      "/employees/:{id}",
      async (params: { id: string }, body: unknown) => {
        const deleteEmployeeSchema = z.object({
          id: z.string().uuid({
            message: "O ID deve ser um uuid",
          }),
        });

        const { id } = params;

        const deleteEmployeeValidation = deleteEmployeeSchema.parse({ id });

        const employee = await this.deleteEmployeeUseCase.execute({ id });

        if (employee.isFailure()) {
          return {
            type: employee.value.type,
            statusCode: employee.value.statusCode,
            message: employee.value.message,
          };
        }

        return {
          type: "OK",
          statusCode: 200,
          employee: {
            ...employee.value,
          },
        };
      }
    );
  }
}

export { EmployeeController };
