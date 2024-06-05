import { randomUUID } from "crypto";
import { OrderFood } from "./order-food";
import { BadRequestError } from "../../application/use-cases/errors/bad-request-error";

type StatusOrder =
  | "Aguardando pagamento"
  | "Pagamento confirmado"
  | "Preparando pedido"
  | "Saiu para entrega"
  | "Pedido concluido"
  | "Cancelado";

class Order {
  private constructor(
    public id: string,
    public id_user: string,
    public id_pix: string | null,
    public id_card: string | null,
    public amount: number = 0,
    public status: StatusOrder = "Aguardando pagamento",
    public order_food: OrderFood[] = []
  ) {}

  static create(id_user: string, id_pix: string | null, id_card: string | null) {
    const id = randomUUID();

    if (id_pix === null && id_card === null) {
      throw new BadRequestError("Escolha alguma forma de pagamento: pix ou cartão");
    }

    if (id_pix !== null && id_card !== null) {
      throw new BadRequestError("Escolha apenas uma forma de pagamento: pix ou cartão");
    }

    return new Order(id, id_user, id_pix, id_card);
  }

  static restore(
    id: string,
    id_user: string,
    id_pix: string | null,
    id_card: string | null,
    amount: number,
    status: StatusOrder,
    order_food: OrderFood[]
  ) {
    return new Order(id, id_user, id_pix, id_card, amount, status, order_food);
  }

  public getId() {
    return this.id;
  }

  public getStatus() {
    return this.status;
  }

  public getAmount() {
    return this.amount;
  }

  public updateStatus(status: StatusOrder) {
    return (this.status = status);
  }
}

export { Order, StatusOrder };
