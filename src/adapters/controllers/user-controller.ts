import { z } from "zod";
import { User } from "../../core/entities/user";
import { HttpServer } from "../../infraestructure/http/http-server";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import {
  FindAllUsersUseCase,
  FindUserByIdUseCase,
  FindUserByEmailUseCase,
  CreateUserUseCase,
  UpdateUserUseCase,
  UpdatePasswordUserUseCase,
  DeleteUserUseCase,
  LoginUserUseCase,
} from "../../application/use-cases/user";

type InfosToken = {
  name: string;
  email: string;
  id_user: string;
};

class UserController {
  constructor(
    private readonly httpServer: HttpServer,
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly updatePasswordUserUseCase: UpdatePasswordUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase
  ) {
    this.httpServer.on("get", [], "/users", async () => {
      const users = await this.findAllUsersUseCase.execute();

      return {
        type: "OK",
        statusCode: 200,
        users,
      };
    });

    this.httpServer.on("get", [], "/users/:{id}", async (params: { id: string }, body: unknown) => {
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
      [],
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

    this.httpServer.on("post", [], "/users", async (params: unknown, body: User) => {
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

    this.httpServer.on("post", [], "/users/login", async (params: unknown, body: User) => {
      const loginUserSchema = z.object({
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

      loginUserSchema.parse({ email, password });

      const token = await this.loginUserUseCase.execute({ email, password });

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
      "/users/:{id}",
      async (params: { id: string }, body: User, infos: InfosToken) => {
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
        const { id_user } = infos;

        updateUserSchema.parse({ id, name });

        const user = await this.updateUserUseCase.execute({ id, name, id_user });

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

    this.httpServer.on(
      "patch",
      [AuthMiddleware.verifyToken],
      "/users/:{id}",
      async (params: { id: string }, body: User, infos: InfosToken) => {
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
        const { id_user } = infos;

        updatePasswordUserSchema.parse({ id, password });

        const user = await this.updatePasswordUserUseCase.execute({ id, password, id_user });

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

    this.httpServer.on(
      "delete",
      [AuthMiddleware.verifyToken],
      "/users/:{id}",
      async (params: { id: string }, body: unknown, infos: InfosToken) => {
        const deleteUserSchema = z.object({
          id: z.string().uuid({
            message: "O ID deve ser um uuid",
          }),
        });

        console.log(infos);

        const { id } = params;
        const { id_user } = infos;

        deleteUserSchema.parse({ id });

        const user = await this.deleteUserUseCase.execute({ id, id_user });

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
  }
}

export { UserController };
