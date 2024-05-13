import { Food } from "./food";

class Order {
  private constructor(
    public id_client: number,
    public foods: Food[],
    public id_pix: number | null,
    public id_card: number | null
  ) {}

  static create(id_client: number, foods: Food[], id_pix: number | null, id_card: number | null) {
    const order = new Order(id_client, foods, id_pix, id_card);

    return order;
  }
}

export { Order };
