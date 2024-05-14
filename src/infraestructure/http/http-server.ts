import cors from "cors";
import bodyParser from "body-parser";
import express, { Request, Response } from "express";

type HttpMethods = "post" | "get" | "put" | "patch" | "delete";

type HttpServer = {
  listen(port: number): void;
  on(method: HttpMethods, url: string, callback: Function): void;
};

class ExpressAdapter implements HttpServer {
  public app: express.Express;

  constructor() {
    this.app = express();
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  public on(method: HttpMethods, url: string, callback: Function): void {
    this.app[method](url, async function (req: Request, res: Response) {
      try {
        const output = await callback(req.params, req.body);

        res.json(output);
      } catch (error: any) {
        res.status(422).json({
          message: error.message,
        });
      }
    });
  }

  public listen(port: number): void {
    this.app.listen(port, () => {
      console.log(`server rodando na porta ${port}`);
    });
  }
}

export { HttpServer, ExpressAdapter };
