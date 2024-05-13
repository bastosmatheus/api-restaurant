class Pix {
  private constructor(public code_generated: string) {}

  static create(code_generated: string) {
    const pix = new Pix(code_generated);

    return pix;
  }
}

export { Pix };
