import { Order } from "../../../core/entities/order";
import { NotFoundError } from "../errors/not-found-error";
import { PixRepository } from "../../../adapters/repositories/pix-repository";
import { UserRepository } from "../../../adapters/repositories/user-repository";
import { CardRepository } from "../../../adapters/repositories/card-repository";
import { OrderRepository } from "../../../adapters/repositories/order-repository";
import { Either, failure, success } from "../../../utils/either";

type CreateOrderUseCaseRequest = {
  id_user: string;
  id_pix: string | null;
  id_card: string | null;
};

class CreateOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private userRepository: UserRepository,
    private pixRepository: PixRepository,
    private cardRepository: CardRepository
  ) {}

  public async execute({
    id_user,
    id_pix,
    id_card,
  }: CreateOrderUseCaseRequest): Promise<Either<NotFoundError, Order>> {
    if (id_pix && !id_card) {
      const pixExists = await this.pixRepository.findById(id_pix);

      if (!pixExists || pixExists.id_user !== id_user) {
        return failure(new NotFoundError(`Nenhum pix encontrado com o ID: ${id_pix}`));
      }
    }

    if (id_card && !id_pix) {
      const cardExists = await this.cardRepository.findById(id_card);

      if (!cardExists || cardExists.id_user !== id_user) {
        return failure(new NotFoundError(`Nenhum cartão encontrado com o ID: ${id_card}`));
      }
    }

    const userExists = await this.userRepository.findById(id_user);

    if (!userExists) {
      return failure(new NotFoundError(`Nenhum usuário encontrado com o ID: ${id_user}`));
    }

    const orderCreated = Order.create(id_user, id_pix, id_card);

    const order = await this.orderRepository.create(orderCreated);

    return success(order);
  }
}

export { CreateOrderUseCase };
