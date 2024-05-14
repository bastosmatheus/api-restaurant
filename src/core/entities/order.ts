import { randomUUID } from "crypto";
import { Food } from "./food";

class Order {
  private constructor(
    public id: string,
    public id_client: string,
    public foods: Food[],
    public id_pix: string | null,
    public id_card: string | null
  ) {}

  static create(id_client: string, foods: Food[], id_pix: string | null, id_card: string | null) {
    const id = randomUUID();

    const order = new Order(id, id_client, foods, id_pix, id_card);

    return order;
  }
}

export { Order };
