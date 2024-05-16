import { randomUUID } from "crypto";
import { Food } from "./food";

class Order {
  public id: string;
  private constructor(
    public id_client: string,
    public foods: Food[],
    public id_pix: string | null,
    public id_card: string | null
  ) {
    this.id = randomUUID();
  }
}

export { Order };
