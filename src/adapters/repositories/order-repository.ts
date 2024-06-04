import { Order, StatusOrder } from "../../core/entities/order";

interface OrderRepository {
  findAll(): Promise<Order[]>;
  findByCards(): Promise<Order[]>;
  findByPixs(): Promise<Order[]>;
  findByCard(id_card: string): Promise<Order[]>;
  findByUser(id_user: string): Promise<Order[]>;
  findByStatus(status: StatusOrder): Promise<Order[]>;
  findById(id: string): Promise<Order | null>;
  create(order: Order): Promise<Order>;
  updateStatus(id: string, status: StatusOrder): Promise<Order>;
}

export { OrderRepository };
