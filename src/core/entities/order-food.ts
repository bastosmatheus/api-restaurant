import { randomUUID } from "crypto";
import { BadRequestError } from "../../application/use-cases/errors/bad-request-error";

class OrderFood {
  private constructor(
    public id: string,
    public quantity: number,
    public id_order: string,
    public id_food: string
  ) {}

  static create(quantity: number, id_order: string, id_food: string) {
    const id = randomUUID();

    if (quantity < 1) {
      throw new BadRequestError("Quantidade deve ser maior que 0");
    }

    return new OrderFood(id, quantity, id_order, id_food);
  }

  static restore(id: string, quantity: number, id_order: string, id_food: string) {
    return new OrderFood(id, quantity, id_order, id_food);
  }

  public getQuantity() {
    return this.quantity;
  }
}

export { OrderFood };
