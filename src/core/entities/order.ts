import { Food } from "./food";
import { randomUUID } from "crypto";

class Order {
  private constructor(
    public id: string,
    public foods: Food[],
    public id_user: string,
    public id_pix: string | null,
    public id_card: string | null
  ) {}

  static create(foods: Food[], id_user: string, id_pix: string | null, id_card: string | null) {
    const id = randomUUID();

    return new Order(id, foods, id_user, id_pix, id_card);
  }

  static restore(
    id: string,
    foods: Food[],
    id_user: string,
    id_pix: string | null,
    id_card: string | null
  ) {
    return new Order(id, foods, id_user, id_pix, id_card);
  }
}

export { Order };
