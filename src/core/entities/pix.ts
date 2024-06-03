import { randomUUID } from "crypto";

type StatusPix = "Aguardando pagamento" | "Pago" | "Expirado";

class Pix {
  private constructor(
    public id: string,
    public code: string,
    public time_pix_generated: Date,
    public id_user: string,
    public status: StatusPix = "Aguardando pagamento"
  ) {}

  static create(id_user: string) {
    const id = randomUUID();

    const code = Pix.randomPix();

    const time_pix_generated = new Date();

    return new Pix(id, code, time_pix_generated, id_user);
  }

  static restore(
    id: string,
    code: string,
    time_pix_generated: Date,
    id_user: string,
    status: StatusPix
  ) {
    return new Pix(id, code, time_pix_generated, id_user, status);
  }

  private static randomPix(size = 50) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let result = "";

    for (let i = 0; i < size; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      result += characters.charAt(randomIndex);
    }

    return result;
  }

  public getId() {
    return this.id;
  }

  public getCode() {
    return this.code;
  }

  public getTimePixExpired() {
    return this.time_pix_generated;
  }

  public getStatus() {
    return this.status;
  }

  public updateStatus() {
    const miliseconds = this.time_pix_generated.getTime() - new Date().getTime();
    const seconds = miliseconds / 1000;
    const minutes = seconds / 60;

    const pixExpired = Math.abs(Math.round(minutes));

    this.status === "Aguardando pagamento" && pixExpired >= 10
      ? (this.status = "Expirado")
      : (this.status = "Pago");

    return this.status;
  }
}

export { Pix, StatusPix };
