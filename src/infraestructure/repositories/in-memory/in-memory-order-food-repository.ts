import { OrderFood } from "../../../core/entities/order-food";
import { OrderFoodRepository } from "../../../adapters/repositories/order-food-repository";

class InMemoryOrderFoodRepository implements OrderFoodRepository {
  private orderFood: OrderFood[] = [];

  public async findAll(): Promise<OrderFood[]> {
    return this.orderFood;
  }

  public async findByFood(id_food: string): Promise<OrderFood[]> {
    const orderFood = this.orderFood.filter((orderFood) => orderFood.id_food === id_food);

    return orderFood;
  }

  public async findByOrder(id_order: string): Promise<OrderFood[]> {
    const orderFood = this.orderFood.filter((orderFood) => orderFood.id_order === id_order);

    return orderFood;
  }

  public async findById(id: string): Promise<OrderFood | null> {
    const orderFood = this.orderFood.find((orderFood) => orderFood.id === id);

    if (!orderFood) {
      return null;
    }

    return orderFood;
  }

  public async create(orderFood: OrderFood): Promise<OrderFood> {
    this.orderFood.push(orderFood);

    return orderFood;
  }
}

export { InMemoryOrderFoodRepository };
