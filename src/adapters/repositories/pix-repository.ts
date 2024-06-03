import { Pix, StatusPix } from "../../core/entities/pix";

interface PixRepository {
  findAll(): Promise<Pix[]>;
  findByUser(id_user: string): Promise<Pix[]>;
  findByStatus(status: StatusPix): Promise<Pix[]>;
  findById(id: string): Promise<Pix | null>;
  findByCode(code: string): Promise<Pix | null>;
  create(pix: Pix): Promise<Pix>;
  updateStatus(id: string, status: StatusPix): Promise<Pix>;
}

export { PixRepository };
