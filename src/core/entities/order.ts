import { Food } from "./food";

class Order {
  constructor(
    public id_client: number,
    public foods: Food[],
    public id_pix: number | null,
    public id_card: number | null
  ) {}
}

export { Order };
