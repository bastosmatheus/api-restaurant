import jwt from "jsonwebtoken";
import { JwtAdapter } from "../../infraestructure/token/token";
import { InfosToken } from "../controllers/user-controller";
import { NextFunction, Request, Response } from "express";

const { JsonWebTokenError, TokenExpiredError } = jwt;

class RoleMiddleware {
  static async verifyRole(req: Request, res: Response, next: NextFunction) {
    const jwt = new JwtAdapter();

    const bearerToken = req.headers["authorization"];

    if (!bearerToken) {
      return res.status(400).json({
        type: "Bad Request",
        statusCode: 400,
        message: "Informe o token de autenticação",
      });
    }

    const token = bearerToken.split(" ")[1];

    const verify = (await jwt.verify(token)) as InfosToken;

    if (verify instanceof TokenExpiredError) {
      return res.status(401).json({
        type: "Unauthorized",
        statusCode: 401,
        message: "Token expirado, faça o login novamente",
      });
    }

    if (verify instanceof JsonWebTokenError) {
      return res.status(401).json({
        type: "Unauthorized",
        statusCode: 401,
        message: "Token inválido ou mal formatado",
      });
    }

    if (!verify.employee_role || verify.employee_role !== "Gerente") {
      return res.status(401).json({
        type: "Unauthorized",
        statusCode: 401,
        message: "Apenas gerentes podem executar essa ação",
      });
    }

    next();
  }
}

export { RoleMiddleware };
