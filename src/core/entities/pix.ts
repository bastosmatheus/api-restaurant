import { randomUUID } from "crypto";

class Pix {
  private constructor(
    public id: string,
    public code_generated: string
  ) {}

  static create(code_generated: string) {
    const id = randomUUID();

    const pix = new Pix(id, code_generated);

    return pix;
  }
}

export { Pix };
