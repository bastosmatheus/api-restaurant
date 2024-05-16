import { randomUUID } from "crypto";

class Pix {
  public id: string;

  private constructor(public code_generated: string) {
    this.id = randomUUID();
  }
}

export { Pix };
