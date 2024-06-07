import bcrypt from "bcrypt";

interface HasherAndCompare {
  hash(plaintext: string): Promise<string>;
  compare(password: string, salt: string): Promise<boolean>;
}

class BcryptAdapter implements HasherAndCompare {
  public readonly bcrypt: typeof bcrypt;

  constructor() {
    this.bcrypt = bcrypt;
  }

  public async compare(plaintext: string, plaintextHashed: string): Promise<boolean> {
    const isValid = await this.bcrypt.compare(plaintext, plaintextHashed);

    return isValid;
  }

  public async hash(plaintext: string): Promise<string> {
    const plaintextHashed = await this.bcrypt.hash(plaintext, 10);

    return plaintextHashed;
  }
}

export { BcryptAdapter, HasherAndCompare };
