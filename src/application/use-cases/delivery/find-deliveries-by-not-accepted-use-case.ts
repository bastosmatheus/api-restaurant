import { DeliveryRepository } from "../../../adapters/repositories/delivery-repository";

class FindDeliveriesByNotAcceptedUseCase {
  constructor(private deliveryRepository: DeliveryRepository) {}

  public async execute() {
    const deliveries = await this.deliveryRepository.findByDeliveriesNotAceppted();

    return deliveries;
  }
}

export { FindDeliveriesByNotAcceptedUseCase };
