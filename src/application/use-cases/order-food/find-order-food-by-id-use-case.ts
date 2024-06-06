import { OrderFood } from "../../../core/entities/order-food";
import { NotFoundError } from "../errors/not-found-error";
import { OrderFoodRepository } from "../../../adapters/repositories/order-food-repository";
import { Either, failure, success } from "../../../utils/either";

type FindOrderFoodByIdUseCaseRequest = {
  id: string;
};

class FindOrderFoodByIdUseCase {
  constructor(private orderFoodRepository: OrderFoodRepository) {}

  public async execute({
    id,
  }: FindOrderFoodByIdUseCaseRequest): Promise<Either<NotFoundError, OrderFood>> {
    const orderFood = await this.orderFoodRepository.findById(id);

    if (!orderFood) {
      return failure(
        new NotFoundError(
          `Nenhum relacionamento entre pedidos e alimentos encontrado com o ID: ${id}`
        )
      );
    }

    return success(orderFood);
  }
}

export { FindOrderFoodByIdUseCase };
