import { Delivery } from "../../core/entities/delivery";

interface DeliveryRepository {
  findAll(): Promise<Delivery[]>;
  findByDeliveryman(id_deliveryman: string | null): Promise<Delivery[]>;
  findById(id: string): Promise<Delivery | null>;
  create(delivery: Delivery): Promise<Delivery>;
  deliveryAccepted(id: string, id_deliveryman: string): Promise<Delivery>;
  deliveryCompleted(id: string): Promise<Delivery>;
}

export { DeliveryRepository };
