import { JwtAdapter } from "../../infraestructure/token/token";
import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { InfosToken } from "../controllers/user-controller";

class AuthMiddleware {
  static async verifyToken(req: Request, res: Response, next: NextFunction) {
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

    req.infosToken = verify;

    next();
  }
}

export { AuthMiddleware };
