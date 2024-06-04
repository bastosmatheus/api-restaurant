import { User } from "../../../core/entities/user";
import { UserRepository } from "../../../adapters/repositories/user-repository";

class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  public async findAll(): Promise<User[]> {
    return this.users;
  }

  public async findById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === id);

    if (!user) {
      return null;
    }

    return User.restore(
      user.id,
      user.name,
      user.email,
      user.password,
      user.pixs,
      user.cards,
      user.orders
    );
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email);

    if (!user) {
      return null;
    }

    return User.restore(
      user.id,
      user.name,
      user.email,
      user.password,
      user.pixs,
      user.cards,
      user.orders
    );
  }

  public async create(user: User): Promise<User> {
    this.users.push(user);

    return user;
  }

  public async update(user: User): Promise<User> {
    const userIndex = this.users.findIndex((userFind) => userFind.id === user.id);

    this.users[userIndex].name = user.name;

    return this.users[userIndex];
  }

  public async updatePasword(id: string, password: string): Promise<User> {
    const userIndex = this.users.findIndex((user) => user.id === id);

    this.users[userIndex].password = password;

    return this.users[userIndex];
  }

  public async delete(id: string): Promise<User> {
    const userIndex = this.users.findIndex((user) => user.id === id);

    this.users.pop();

    return this.users[userIndex];
  }
}

export { InMemoryUserRepository };
