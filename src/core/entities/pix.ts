import { randomUUID } from "crypto";

class Pix {
  private constructor(
    public id: string,
    public code_generated: string,
    public id_user: string
  ) {}

  static create(code_generated: string, id_user: string) {
    const id = randomUUID();

    return new Pix(id, code_generated, id_user);
  }

  static restore(id: string, code_generated: string, id_user: string) {
    return new Pix(id, code_generated, id_user);
  }
}

export { Pix };
