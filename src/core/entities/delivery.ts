import { randomUUID } from "crypto";

class Delivery {
  private constructor(
    public id: string,
    public id_order: string,
    public id_deliveryman: string | null = null,
    public delivery_accepted: Date | null = null,
    public delivery_completed: Date | null = null
  ) {}

  static create(id_order: string) {
    const id = randomUUID();

    return new Delivery(id, id_order);
  }

  static restore(
    id: string,
    id_order: string,
    id_deliveryman: string | null,
    delivery_accepted: Date | null,
    delivery_completed: Date | null
  ) {
    return new Delivery(id, id_order, id_deliveryman, delivery_accepted, delivery_completed);
  }

  public getId() {
    return this.id;
  }

  public getDeliveryAccepted() {
    return this.delivery_accepted;
  }

  public getDeliveryCompleted() {
    return this.delivery_completed;
  }

  public deliveryAccepted(id_deliveryman: string) {
    this.id_deliveryman = id_deliveryman;

    return (this.delivery_accepted = new Date());
  }

  public deliveryCompleted() {
    return (this.delivery_completed = new Date());
  }
}

export { Delivery };
