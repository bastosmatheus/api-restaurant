import { DeliveryRepository } from "../../../adapters/repositories/delivery-repository";

class FindAllDeliveriesUseCase {
  constructor(private deliveryRepository: DeliveryRepository) {}

  public async execute() {
    const deliveries = await this.deliveryRepository.findAll();

    return deliveries;
  }
}

export { FindAllDeliveriesUseCase };
