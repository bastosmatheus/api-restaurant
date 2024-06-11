import jwt, { JwtPayload } from "jsonwebtoken";
import { configDotenv } from "dotenv";

const env = configDotenv();

interface Token {
  sign(data: unknown): Promise<string>;
  verify(token: string): Promise<unknown>;
}

class JwtAdapter implements Token {
  private readonly jwt: typeof jwt;

  constructor() {
    this.jwt = jwt;
  }

  public async sign(data: {}): Promise<string> {
    const token = this.jwt.sign(data, process.env.SECRET_KEY as string, { expiresIn: "30d" });

    return token;
  }

  public async verify(token: string): Promise<unknown> {
    try {
      const decoded = this.jwt.verify(token, process.env.SECRET_KEY as string) as JwtPayload;

      return decoded;
    } catch (error) {
      return error;
    }
  }
}

export { JwtAdapter, Token };
