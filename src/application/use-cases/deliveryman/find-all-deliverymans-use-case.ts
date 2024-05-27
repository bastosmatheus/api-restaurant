import { DeliverymanRepository } from "../../../adapters/repositories/deliveryman-repository";

class FindAllDeliverymansUseCase {
  constructor(private deliverymanRepository: DeliverymanRepository) {}

  public async execute() {
    const deliverymans = await this.deliverymanRepository.findAll();

    return deliverymans;
  }
}

export { FindAllDeliverymansUseCase };
