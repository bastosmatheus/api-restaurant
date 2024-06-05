import { DeliveryRepository } from "../../../adapters/repositories/delivery-repository";

type FindDeliveriesByDeliverymanUseCaseRequest = {
  id_deliveryman: string | null;
};

class FindDeliveriesByDeliverymanUseCase {
  constructor(private deliveryRepository: DeliveryRepository) {}

  public async execute({ id_deliveryman }: FindDeliveriesByDeliverymanUseCaseRequest) {
    const deliveries = await this.deliveryRepository.findByDeliveryman(id_deliveryman);

    return deliveries;
  }
}

export { FindDeliveriesByDeliverymanUseCase };
