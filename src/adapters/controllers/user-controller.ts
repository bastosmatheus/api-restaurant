import { z } from "zod";
import { User } from "../../core/entities/user";
import { HttpServer } from "../../infraestructure/http/http-server";
import { CreateUserUseCase } from "../../application/use-cases/user/create-user-use-case";
import { UpdateUserUseCase } from "../../application/use-cases/user/update-user-use-case";
import { DeleteUserUseCase } from "../../application/use-cases/user/delete-user-use-case";
import { FindAllUsersUseCase } from "../../application/use-cases/user/find-all-users-use-case";
import { FindUserByIdUseCase } from "../../application/use-cases/user/find-user-by-id-use-case";
import { FindUserByEmailUseCase } from "../../application/use-cases/user/find-user-by-email-use-case";
import { UpdatePasswordUserUseCase } from "../../application/use-cases/user/update-password-user-use-case";

class UserController {
  constructor(
    private readonly httpServer: HttpServer,
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly updatePasswordUserUseCase: UpdatePasswordUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase
  ) {
    this.httpServer.on("get", "/users", async () => {
      const users = await this.findAllUsersUseCase.execute();

      return {
        type: "OK",
        statusCode: 200,
        users,
      };
    });

    this.httpServer.on("get", "/users/:{id}", async (params: { id: string }, body: unknown) => {
      const findUserByIdSchema = z.object({
        id: z.string().uuid({
          message: "O ID deve ser um uuid",
        }),
      });

      const { id } = params;

      findUserByIdSchema.parse({ id });

      const user = await this.findUserByIdUseCase.execute({ id });

      if (user.isFailure()) {
        return {
          type: user.value.type,
          statusCode: user.value.statusCode,
          message: user.value.message,
        };
      }

      return {
        type: "OK",
        statusCode: 200,
        user: {
          ...user.value,
        },
      };
    });

    this.httpServer.on(
      "get",
      "/users/email/:{email}",
      async (params: { email: string }, body: unknown) => {
        const findUserByEmailSchema = z.object({
          email: z
            .string({
              invalid_type_error: "O email deve ser uma string",
              required_error: "Informe o email",
            })
            .email({ message: "Email inválido" }),
        });

        const { email } = params;

        findUserByEmailSchema.parse({ email });

        const user = await this.findUserByEmailUseCase.execute({ email });

        if (user.isFailure()) {
          return {
            type: user.value.type,
            statusCode: user.value.statusCode,
            message: user.value.message,
          };
        }

        return {
          type: "OK",
          statusCode: 200,
          user: {
            ...user.value,
          },
        };
      }
    );

    this.httpServer.on("post", "/users", async (params: unknown, body: User) => {
      const createUserSchema = z.object({
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
      });

      const { name, email, password } = body;

      createUserSchema.parse({ name, email, password });

      const user = await this.createUserUseCase.execute({ name, email, password });

      if (user.isFailure()) {
        return {
          type: user.value.type,
          statusCode: user.value.statusCode,
          message: user.value.message,
        };
      }

      return {
        type: "Created",
        statusCode: 201,
        user: {
          ...user.value,
        },
      };
    });

    this.httpServer.on("put", "/users/:{id}", async (params: { id: string }, body: User) => {
      const updateUserSchema = z.object({
        id: z.string().uuid({
          message: "O ID deve ser um uuid",
        }),
        name: z
          .string({
            invalid_type_error: "O nome deve ser uma string",
            required_error: "Informe o nome",
          })
          .min(3, { message: "O nome deve ter no minimo 3 caracteres" }),
      });

      const { id } = params;
      const { name } = body;

      updateUserSchema.parse({ id, name });

      const user = await this.updateUserUseCase.execute({ id, name });

      if (user.isFailure()) {
        return {
          type: user.value.type,
          statusCode: user.value.statusCode,
          message: user.value.message,
        };
      }

      return {
        type: "OK",
        statusCode: 200,
        user: {
          ...user.value,
        },
      };
    });

    this.httpServer.on("patch", "/users/:{id}", async (params: { id: string }, body: User) => {
      const updatePasswordUserSchema = z.object({
        id: z.string().uuid({
          message: "O ID deve ser um uuid",
        }),
        password: z
          .string({
            required_error: "Informe a senha",
            invalid_type_error: "A senha deve ser uma string",
          })
          .min(5, { message: "A senha deve ter no mínimo 5 caracteres" }),
      });

      const { id } = params;
      const { password } = body;

      updatePasswordUserSchema.parse({ id, password });

      const user = await this.updatePasswordUserUseCase.execute({ id, password });

      if (user.isFailure()) {
        return {
          type: user.value.type,
          statusCode: user.value.statusCode,
          message: user.value.message,
        };
      }

      return {
        type: "OK",
        statusCode: 200,
        user: {
          ...user.value,
        },
      };
    });

    this.httpServer.on("delete", "/users/:{id}", async (params: { id: string }, body: unknown) => {
      const deleteUserSchema = z.object({
        id: z.string().uuid({
          message: "O ID deve ser um uuid",
        }),
      });

      const { id } = params;

      deleteUserSchema.parse({ id });

      const user = await this.deleteUserUseCase.execute({ id });

      if (user.isFailure()) {
        return {
          type: user.value.type,
          statusCode: user.value.statusCode,
          message: user.value.message,
        };
      }

      return {
        type: "OK",
        statusCode: 200,
        user: {
          ...user.value,
        },
      };
    });
  }
}

export { UserController };
