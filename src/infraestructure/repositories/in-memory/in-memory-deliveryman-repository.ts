import { DeliverymanRepository } from "../../../adapters/repositories/deliveryman-repository";
import { Deliveryman } from "../../../core/entities/deliveryman";

class InMemoryDeliverymanRepository implements DeliverymanRepository {
  private deliverymans: Deliveryman[] = [];

  public async findAll(): Promise<Deliveryman[]> {
    return this.deliverymans;
  }

  public async findById(id: string): Promise<Deliveryman | null> {
    const deliveryman = this.deliverymans.find((deliveryman) => deliveryman.id === id);

    if (!deliveryman) {
      return null;
    }

    return Deliveryman.restore(
      deliveryman.id,
      deliveryman.name,
      deliveryman.email,
      deliveryman.password,
      deliveryman.birthday_date,
      deliveryman.deliveries
    );
  }

  public async findByEmail(email: string): Promise<Deliveryman | null> {
    const deliveryman = this.deliverymans.find((deliveryman) => deliveryman.email === email);

    if (!deliveryman) {
      return null;
    }

    return Deliveryman.restore(
      deliveryman.id,
      deliveryman.name,
      deliveryman.email,
      deliveryman.password,
      deliveryman.birthday_date,
      deliveryman.deliveries
    );
  }

  public async create({ name, email, password, birthday_date }: Deliveryman): Promise<Deliveryman> {
    const deliveryman = Deliveryman.create(name, email, password, birthday_date);

    this.deliverymans.push(deliveryman);

    return deliveryman;
  }

  public async update({ id, name }: Deliveryman): Promise<Deliveryman> {
    const deliverymanIndex = this.deliverymans.findIndex((deliveryman) => deliveryman.id === id);

    this.deliverymans[deliverymanIndex].setName(name);

    return this.deliverymans[deliverymanIndex];
  }

  public async updatePassword(id: string, password: string): Promise<Deliveryman> {
    const deliverymanIndex = this.deliverymans.findIndex((deliveryman) => deliveryman.id === id);

    this.deliverymans[deliverymanIndex].setPassword(password);

    return this.deliverymans[deliverymanIndex];
  }

  public async delete(id: string): Promise<Deliveryman> {
    const deliverymanIndex = this.deliverymans.findIndex((deliveryman) => deliveryman.id === id);

    this.deliverymans.pop();

    return this.deliverymans[deliverymanIndex];
  }
}

export { InMemoryDeliverymanRepository };
