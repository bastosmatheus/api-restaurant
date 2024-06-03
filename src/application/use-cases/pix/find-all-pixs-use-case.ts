import { PixRepository } from "../../../adapters/repositories/pix-repository";

class FindAllPixsUseCase {
  constructor(private pixRepository: PixRepository) {}

  public async execute() {
    const pixs = await this.pixRepository.findAll();

    return pixs;
  }
}

export { FindAllPixsUseCase };
