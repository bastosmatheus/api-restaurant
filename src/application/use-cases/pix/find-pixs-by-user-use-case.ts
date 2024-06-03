import { PixRepository } from "../../../adapters/repositories/pix-repository";

type FindPixsByUserUseCaseRequest = {
  id_user: string;
};

class FindPixsByUserUseCase {
  constructor(private pixRepository: PixRepository) {}

  public async execute({ id_user }: FindPixsByUserUseCaseRequest) {
    const pixs = await this.pixRepository.findByUser(id_user);

    return pixs;
  }
}

export { FindPixsByUserUseCase };
