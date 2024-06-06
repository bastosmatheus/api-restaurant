import { Delivery } from "../../core/entities/delivery";

interface DeliveryRepository {
  findAll(): Promise<Delivery[]>;
  findByDeliveriesNotAceppted(): Promise<Delivery[]>;
  findByDeliveryman(id_deliveryman: string): Promise<Delivery[]>;
  findById(id: string): Promise<Delivery | null>;
  create(delivery: Delivery): Promise<Delivery>;
  deliveryAccepted(
    id: string,
    id_deliveryman: string,
    dateDeliveryAccepted: Date
  ): Promise<Delivery>;
  deliveryCompleted(id: string, dateDeliveryCompleted: Date): Promise<Delivery>;
}

export { DeliveryRepository };
