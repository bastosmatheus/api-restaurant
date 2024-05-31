import { UserRepository } from "../../../adapters/repositories/user-repository";

class FindAllUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  public async execute() {
    const users = await this.userRepository.findAll();

    return users;
  }
}

export { FindAllUsersUseCase };
