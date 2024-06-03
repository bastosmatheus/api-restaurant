import { StatusPix } from "../../../core/entities/pix";
import { PixRepository } from "../../../adapters/repositories/pix-repository";

type FindPixsByStatusUseCaseRequest = {
  status: StatusPix;
};

class FindPixsByStatusUseCase {
  constructor(private pixRepository: PixRepository) {}

  public async execute({ status }: FindPixsByStatusUseCaseRequest) {
    const pixs = await this.pixRepository.findByStatus(status);

    return pixs;
  }
}

export { FindPixsByStatusUseCase };
