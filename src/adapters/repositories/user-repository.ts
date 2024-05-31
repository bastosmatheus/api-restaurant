import { User } from "../../core/entities/user";

interface UserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  updatePasword(id: string, password: string): Promise<User>;
  delete(id: string): Promise<User>;
}

export { UserRepository };
