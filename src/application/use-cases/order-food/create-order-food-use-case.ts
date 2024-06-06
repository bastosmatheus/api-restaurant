import { OrderFood } from "../../../core/entities/order-food";
import { NotFoundError } from "../errors/not-found-error";
import { FoodRepository } from "../../../adapters/repositories/food-repository";
import { OrderRepository } from "../../../adapters/repositories/order-repository";
import { OrderFoodRepository } from "../../../adapters/repositories/order-food-repository";
import { Either, failure, success } from "../../../utils/either";

type CreateOrderFoodUseCaseRequest = {
  quantity: number;
  id_order: string;
  id_food: string;
};

class CreateOrderFoodUseCase {
  constructor(
    private orderFoodRepository: OrderFoodRepository,
    private orderRepository: OrderRepository,
    private foodRepository: FoodRepository
  ) {}

  public async execute({
    quantity,
    id_order,
    id_food,
  }: CreateOrderFoodUseCaseRequest): Promise<Either<NotFoundError, OrderFood>> {
    const orderExists = await this.orderRepository.findById(id_order);

    if (!orderExists) {
      return failure(new NotFoundError(`Nenhum pedido encontrado com o ID: ${id_order}`));
    }

    const foodExists = await this.foodRepository.findById(id_food);

    if (!foodExists) {
      return failure(new NotFoundError(`Nenhum alimento encontrado com o ID: ${id_food}`));
    }

    const orderFoodCreated = OrderFood.create(quantity, id_order, id_food);

    const orderFood = await this.orderFoodRepository.create(orderFoodCreated);

    return success(orderFood);
  }
}

export { CreateOrderFoodUseCase };
