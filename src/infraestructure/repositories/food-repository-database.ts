import { Food } from "../../core/entities/food";
import { DatabaseConnection } from "../database/database-connection";
import { FoodRepository } from "../../adapters/repositories/food-repository";

class FoodRepositoryDatabase implements FoodRepository {
  constructor(private databaseConnection: DatabaseConnection) {}

  public async findAll(): Promise<Food[]> {
    const foods = await this.databaseConnection.query<Food>(/*sql*/ `SELECT * FROM foods`);

    return foods;
  }

  public async findFoodById(id: string): Promise<Food | null> {
    const [food] = await this.databaseConnection.query<Food>(/*sql*/ `SELECT * FROM foods 
      WHERE id = ${id}`);

    if (!food) {
      return null;
    }

    return food;
  }

  public async findFoodByName(food_name: string): Promise<Food | null> {
    const [food] = await this.databaseConnection.query<Food>(/*sql*/ `SELECT * FROM foods 
      WHERE food_name = ${food_name}`);

    if (!food) {
      return null;
    }

    return food;
  }

  public async create({ id, food_name, price, description, category, image }: Food): Promise<Food> {
    const [food] = await this.databaseConnection
      .query<Food>(/*sql*/ `INSERT INTO foods (id, food_name, price, description, category, image) 
      VALUES ((${id}, ${food_name}, ${price}, ${description}, ${category}, ${image})) 
      
      RETURNING *`);

    return food;
  }

  public async update({ id, food_name, price, description, category, image }: Food): Promise<Food> {
    const [food] = await this.databaseConnection.query<Food>(/*sql*/ `UPDATE foods
      SET food_name = ${food_name}, price = ${price}, description = ${description}, category = ${category}, image = ${image}
      WHERE id = ${id}
      
      RETURNING *`);

    return food;
  }

  public async delete(id: string): Promise<Food | null> {
    const [food] = await this.databaseConnection.query<Food>(/*sql*/ `DELETE FROM foods 
      WHERE id = ${id} 
      
      RETURNING *`);

    if (!food) {
      return null;
    }

    return food;
  }
}

export { FoodRepositoryDatabase };
