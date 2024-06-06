import { OrderFood } from "../../core/entities/order-food";

interface OrderFoodRepository {
  findAll(): Promise<OrderFood[]>;
  findByFood(id_food: string): Promise<OrderFood[]>;
  findByOrder(id_order: string): Promise<OrderFood[]>;
  findById(id: string): Promise<OrderFood | null>;
  create(orderFood: OrderFood): Promise<OrderFood>;
}

export { OrderFoodRepository };
