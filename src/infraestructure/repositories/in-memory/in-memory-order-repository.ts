import { OrderRepository } from "../../../adapters/repositories/order-repository";
import { Order, StatusOrder } from "../../../core/entities/order";

class InMemoryOrderRepository implements OrderRepository {
  private orders: Order[] = [];

  public async findAll(): Promise<Order[]> {
    return this.orders;
  }

  public async findByCards(): Promise<Order[]> {
    const orders = this.orders.filter((order) => order.id_card !== null);

    return orders;
  }

  public async findByPixs(): Promise<Order[]> {
    const orders = this.orders.filter((order) => order.id_pix !== null);

    return orders;
  }

  public async findByCard(id_card: string): Promise<Order[]> {
    const orders = this.orders.filter((order) => order.id_card === id_card);

    return orders;
  }

  public async findByUser(id_user: string): Promise<Order[]> {
    const orders = this.orders.filter((order) => order.id_user === id_user);

    return orders;
  }

  public async findByStatus(status: StatusOrder): Promise<Order[]> {
    const orders = this.orders.filter((order) => order.status === status);

    return orders;
  }

  public async findById(id: string): Promise<Order | null> {
    const order = this.orders.find((order) => order.id === id);

    if (!order) {
      return null;
    }

    return order;
  }

  public async create(order: Order): Promise<Order> {
    this.orders.push(order);

    return order;
  }

  public async updateStatus(
    id: string,
    status:
      | "Pagamento confirmado"
      | "Preparando pedido"
      | "Saiu para entrega"
      | "Pedido concluido"
      | "Cancelado"
  ): Promise<Order> {
    const orderIndex = this.orders.findIndex((order) => order.id === id);

    this.orders[orderIndex].status = status;

    return this.orders[orderIndex];
  }
}

export { InMemoryOrderRepository };
