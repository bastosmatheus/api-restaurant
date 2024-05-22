import { Food } from "../../core/entities/food";
import { FoodRepository } from "../../adapters/repositories/food-repository";
import { DatabaseConnection } from "../database/database-connection";

class FoodRepositoryDatabase implements FoodRepository {
  constructor(private databaseConnection: DatabaseConnection) {}

  public async findAll(): Promise<Food[]> {
    const foods = await this.databaseConnection.query(`SELECT * FROM foods`, []);

    return foods;
  }

  public async findFoodsByCategory(category: string): Promise<Food[]> {
    const foods = await this.databaseConnection.query(`SELECT * FROM foods WHERE category = $1`, [
      category,
    ]);

    return foods;
  }

  public async findFoodById(id: string): Promise<Food | null> {
    const [food] = await this.databaseConnection.query(`SELECT * FROM foods WHERE id = $1`, [id]);

    if (!food) {
      return null;
    }

    return Food.restore(
      food.id,
      food.food_name,
      food.price,
      food.description,
      food.category,
      food.image
    );
  }

  public async findFoodByName(food_name: string): Promise<Food | null> {
    const [food] = await this.databaseConnection.query(`SELECT * FROM foods WHERE food_name = $1`, [
      food_name,
    ]);

    if (!food) {
      return null;
    }

    return Food.restore(
      food.id,
      food.food_name,
      food.price,
      food.description,
      food.category,
      food.image
    );
  }

  public async create({ id, food_name, price, description, category, image }: Food): Promise<Food> {
    const [food] = await this.databaseConnection.query(
      `
      INSERT INTO foods (id, food_name, price, description, category, image) 
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [id, food_name, price, description, category, image]
    );

    return food;
  }

  public async update({ id, food_name, price, description, category, image }: Food): Promise<Food> {
    const [food] = await this.databaseConnection.query(
      `
      UPDATE foods
      SET food_name = $2, price = $3, description = $4, category = $5, image = $6
      WHERE id = $1
      RETURNING *`,
      [id, food_name, price, description, category, image]
    );

    return food;
  }

  public async delete(id: string): Promise<Food> {
    const [food] = await this.databaseConnection.query(
      `
      DELETE FROM foods 
      WHERE id = $1
      RETURNING *`,
      [id]
    );

    return food;
  }
}

export { FoodRepositoryDatabase };
