import { Token } from "../../infraestructure/token/token";
import { NextFunction, Request, Response } from "express";

class EmployeeMiddleware {
  constructor(private token: Token) {}

  public async verifyToken(req: Request, res: Response, next: NextFunction) {
    const bearerToken = req.headers.authorization;

    if (!bearerToken) {
      return res.status(400).json({
        type: "Bad Request",
        statusCode: 400,
        message: "Informe o token de autenticação",
      });
    }

    const token = bearerToken.split(" ")[1];

    const verify = await this.token.verify(token);

    console.log(verify);

    next();
  }
}

export { EmployeeMiddleware };
