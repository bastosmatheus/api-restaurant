import { Deliveryman } from "../../core/entities/deliveryman";

interface DeliverymanRepository {
  findAll(): Promise<Deliveryman[]>;
  findById(id: string): Promise<Deliveryman | null>;
  findByEmail(email: string): Promise<Deliveryman | null>;
  create(deliveryman: Deliveryman): Promise<Deliveryman>;
  update(deliveryman: Deliveryman): Promise<Deliveryman>;
  updatePassword(id: string, password: string): Promise<Deliveryman>;
  delete(id: string): Promise<Deliveryman>;
}

export { DeliverymanRepository };
