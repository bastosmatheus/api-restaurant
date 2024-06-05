import { Delivery } from "../../../core/entities/delivery";
import { DeliveryRepository } from "../../../adapters/repositories/delivery-repository";

class InMemoryDeliveryRepository implements DeliveryRepository {
  private deliveries: Delivery[] = [];

  public async findAll(): Promise<Delivery[]> {
    return this.deliveries;
  }

  public async findByDeliveryman(id_deliveryman: string): Promise<Delivery[]> {
    const deliveries = this.deliveries.filter(
      (delivery) => delivery.id_deliveryman === id_deliveryman
    );

    return deliveries;
  }

  public async findById(id: string): Promise<Delivery | null> {
    const delivery = this.deliveries.find((delivery) => delivery.id === id);

    if (!delivery) {
      return null;
    }

    return Delivery.restore(
      delivery.id,
      delivery.id_order,
      delivery.id_deliveryman,
      delivery.delivery_accepted,
      delivery.delivery_completed
    );
  }

  public async create(delivery: Delivery): Promise<Delivery> {
    this.deliveries.push(delivery);

    return delivery;
  }

  public async deliveryAccepted(id: string, id_deliveryman: string): Promise<Delivery> {
    const deliveryIndex = this.deliveries.findIndex((delivery) => delivery.id === id);

    this.deliveries[deliveryIndex].id_deliveryman = id_deliveryman;
    this.deliveries[deliveryIndex].delivery_accepted = new Date();

    return this.deliveries[deliveryIndex];
  }

  public async deliveryCompleted(id: string): Promise<Delivery> {
    const deliveryIndex = this.deliveries.findIndex((delivery) => delivery.id === id);

    this.deliveries[deliveryIndex].delivery_completed = new Date();

    return this.deliveries[deliveryIndex];
  }
}

export { InMemoryDeliveryRepository };
