import { z } from "zod";
import { HttpServer } from "../../infraestructure/http/http-server";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { Employee, EmployeeRole } from "../../core/entities/employee";
import {
  FindAllEmployeesUseCase,
  FindEmployeesByRoleUseCase,
  FindEmployeeByIdUseCase,
  FindEmployeeByEmailUseCase,
  CreateEmployeeUseCase,
  UpdateEmployeeUseCase,
  UpdatePasswordEmployeeUseCase,
  DeleteEmployeeUseCase,
  LoginEmployeeUseCase,
} from "../../application/use-cases/employee";

type InfosToken = {
  name: string;
  email: string;
  employee_role: string;
  id_employee: string;
};

class EmployeeController {
  constructor(
    private readonly httpServer: HttpServer,
    private readonly findAllEmployeesUseCase: FindAllEmployeesUseCase,
    private readonly findEmployeesByRoleUseCase: FindEmployeesByRoleUseCase,
    private readonly findEmployeeByIdUseCase: FindEmployeeByIdUseCase,
    private readonly findEmployeeByEmailUseCase: FindEmployeeByEmailUseCase,
    private readonly createEmployeeUseCase: CreateEmployeeUseCase,
    private readonly updateEmployeeUseCase: UpdateEmployeeUseCase,
    private readonly updatePasswordEmployeeUseCase: UpdatePasswordEmployeeUseCase,
    private readonly deleteEmployeeUseCase: DeleteEmployeeUseCase,
    private readonly loginEmployeeUseCase: LoginEmployeeUseCase
  ) {
    this.httpServer.on("get", [], "/employees", async () => {
      const employees = await this.findAllEmployeesUseCase.execute();

      return {
        type: "OK",
        statusCode: 200,
        employees,
      };
    });

    this.httpServer.on(
      "get",
      [],
      "/employees/role/:{employee_role}",
      async (params: { employee_role: EmployeeRole }, body: unknown) => {
        const findEmployeesByRoleSchema = z.object({
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

              return { message: "Erro de validação." };
            },
          }),
        });

        const { employee_role } = params;

        findEmployeesByRoleSchema.parse({
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

    this.httpServer.on(
      "get",
      [],
      "/employees/:{id}",
      async (params: { id: string }, body: unknown) => {
        const findEmployeeByIdSchema = z.object({
          id: z.string().uuid({
            message: "O ID deve ser um uuid",
          }),
        });

        const { id } = params;

        findEmployeeByIdSchema.parse({ id });

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
      }
    );

    this.httpServer.on(
      "get",
      [],
      "/employees/email/:{email}",
      async (params: { email: string }, body: unknown) => {
        const findEmployeeByEmailSchema = z.object({
          email: z
            .string({
              invalid_type_error: "O email deve ser uma string",
              required_error: "Informe o email",
            })
            .email({ message: "Email inválido" }),
        });

        const { email } = params;

        findEmployeeByEmailSchema.parse({ email });

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

    this.httpServer.on("post", [], "/employees", async (params: unknown, body: Employee) => {
      const createEmployeeSchema = z.object({
        name: z
          .string({
            invalid_type_error: "O nome deve ser uma string",
            required_error: "Informe o nome",
          })
          .min(3, { message: "O nome deve ter no minimo 3 caracteres" }),
        email: z
          .string({
            invalid_type_error: "O email deve ser uma string",
            required_error: "Informe o email",
          })
          .email({ message: "Email inválido" }),
        password: z
          .string({
            required_error: "Informe a senha",
            invalid_type_error: "A senha deve ser uma string",
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

            return { message: "Erro de validação." };
          },
        }),
      });

      const { name, email, password, employee_role } = body;

      createEmployeeSchema.parse({
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

    this.httpServer.on("post", [], "/employees/login", async (params: unknown, body: Employee) => {
      const loginEmployeeSchema = z.object({
        email: z
          .string({
            invalid_type_error: "O email deve ser uma string",
            required_error: "Informe o email",
          })
          .email({ message: "Email inválido" }),
        password: z
          .string({
            required_error: "Informe a senha",
            invalid_type_error: "A senha deve ser uma string",
          })
          .min(5, { message: "A senha deve ter no mínimo 5 caracteres" }),
      });

      const { email, password } = body;

      loginEmployeeSchema.parse({ email, password });

      const token = await this.loginEmployeeUseCase.execute({ email, password });

      if (token.isFailure()) {
        return {
          type: token.value.type,
          statusCode: token.value.statusCode,
          message: token.value.message,
        };
      }

      return {
        type: "OK",
        statusCode: 200,
        token: token.value,
      };
    });

    this.httpServer.on(
      "put",
      [AuthMiddleware.verifyToken],
      "/employees/:{id}",
      async (params: { id: string }, body: Employee, infos: InfosToken) => {
        const updateEmployeeSchema = z.object({
          id: z.string().uuid({
            message: "O ID deve ser um uuid",
          }),
          name: z
            .string({
              invalid_type_error: "O nome deve ser uma string",
              required_error: "Informe o nome",
            })
            .min(3, { message: "O nome deve ter no minimo 3 caracteres" }),
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

              return { message: "Erro de validação." };
            },
          }),
        });

        const { id } = params;
        const { name, employee_role } = body;
        const { id_employee } = infos;

        updateEmployeeSchema.parse({
          id,
          name,
          employee_role,
        });

        const employee = await this.updateEmployeeUseCase.execute({
          id,
          name,
          employee_role,
          id_employee,
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
      [AuthMiddleware.verifyToken],
      "/employees/:{id}",
      async (params: { id: string }, body: Employee, infos: InfosToken) => {
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
        const { id_employee } = infos;

        updatePasswordSchema.parse({
          id,
          password,
        });

        const employee = await this.updatePasswordEmployeeUseCase.execute({
          id,
          password,
          id_employee,
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
      [AuthMiddleware.verifyToken],
      "/employees/:{id}",
      async (params: { id: string }, body: unknown, infos: InfosToken) => {
        const deleteEmployeeSchema = z.object({
          id: z.string().uuid({
            message: "O ID deve ser um uuid",
          }),
        });

        const { id } = params;
        const { id_employee } = infos;

        deleteEmployeeSchema.parse({ id });

        const employee = await this.deleteEmployeeUseCase.execute({ id, id_employee });

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
