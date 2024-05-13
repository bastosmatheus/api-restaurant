class Food {
  private constructor(
    public name: string,
    public price: number,
    public description: string,
    public category: string,
    public image: string
  ) {}

  static create(name: string, price: number, description: string, category: string, image: string) {
    const food = new Food(name, price, description, category, image);

    return food;
  }
}

export { Food };
