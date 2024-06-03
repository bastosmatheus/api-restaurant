import { Pix, StatusPix } from "../../../core/entities/pix";
import { PixRepository } from "../../../adapters/repositories/pix-repository";

class InMemoryPixRepository implements PixRepository {
  private pixs: Pix[] = [];

  public async findAll(): Promise<Pix[]> {
    return this.pixs;
  }

  public async findByUser(id_user: string): Promise<Pix[]> {
    const pixs = this.pixs.filter((pix) => pix.id_user === id_user);

    return pixs;
  }

  public async findByStatus(status: StatusPix): Promise<Pix[]> {
    const pixs = this.pixs.filter((pix) => pix.status === status);

    return pixs;
  }

  public async findById(id: string): Promise<Pix | null> {
    const pix = this.pixs.find((pix) => pix.id === id);

    if (!pix) {
      return null;
    }

    return Pix.restore(pix.id, pix.code, pix.time_pix_generated, pix.id_user, pix.status);
  }

  public async findByCode(code: string): Promise<Pix | null> {
    const pix = this.pixs.find((pix) => pix.code === code);

    if (!pix) {
      return null;
    }

    return Pix.restore(pix.id, pix.code, pix.time_pix_generated, pix.id_user, pix.status);
  }

  public async create({ id_user }: Pix): Promise<Pix> {
    const pix = Pix.create(id_user);

    this.pixs.push(pix);

    return pix;
  }

  public async updateStatus(id: string, status: StatusPix): Promise<Pix> {
    const pixIndex = this.pixs.findIndex((pix) => pix.id === id);

    this.pixs[pixIndex].status = status;

    return this.pixs[pixIndex];
  }
}

export { InMemoryPixRepository };
