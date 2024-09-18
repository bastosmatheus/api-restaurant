import { Request } from "express"; // Importa a interface Request
import { InfosToken } from "../adapters/controllers/user-controller";

declare global {
  namespace Express {
    interface Request {
      infosToken?: InfosToken;
    }
  }
}
