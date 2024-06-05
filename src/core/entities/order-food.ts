import { randomUUID } from "crypto";
import { BadRequestError } from "../../application/use-cases/errors/bad-request-error";

class OrderFood {
  private constructor(
    public id: string,
    public id_order: string,
    public id_food: string,
    public quantity: number
  ) {}

  static create(id_order: string, id_food: string, quantity: number) {
    const id = randomUUID();

    if (quantity < 1) {
      throw new BadRequestError("Quantidade deve ser maior que 0");
    }

    return new OrderFood(id, id_order, id_food, quantity);
  }

  static restore(id: string, id_order: string, id_food: string, quantity: number) {
    return new OrderFood(id, id_order, id_food, quantity);
  }

  public getQuantity() {
    return this.quantity;
  }
}

export { OrderFood };
