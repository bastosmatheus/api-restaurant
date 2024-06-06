import { Food } from "../../core/entities/food";
import { FoodRepository } from "../../adapters/repositories/food-repository";
import { DatabaseConnection } from "../database/database-connection";

class FoodRepositoryDatabase implements FoodRepository {
  constructor(private databaseConnection: DatabaseConnection) {}

  public async findAll(): Promise<Food[]> {
    const foods = await this.databaseConnection.query(
      `
      SELECT 
      foods.id,
      foods.food_name,
      foods.price,
      foods.description,
      foods.category,
      foods.image,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
              'id', orders_foods.id,
              'id_order', orders_foods.id_order,
              'id_food', orders_foods.id_food
          )
      ) FILTER (WHERE orders_foods.id IS NOT NULL), '[]' ) AS orders_foods
      FROM 
        foods
      LEFT JOIN
        orders_foods ON foods.id = orders_foods.id_food
      GROUP BY
        foods.id
      `,
      []
    );

    return foods;
  }

  public async findByCategory(category: string): Promise<Food[]> {
    const foods = await this.databaseConnection.query(
      `
      SELECT 
      foods.id,
      foods.food_name,
      foods.price,
      foods.description,
      foods.category,
      foods.image,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
              'id', orders_foods.id,
              'id_order', orders_foods.id_order,
              'id_food', orders_foods.id_food
          )
      ) FILTER (WHERE orders_foods.id IS NOT NULL), '[]' ) AS orders_foods
      FROM 
        foods
      LEFT JOIN
        orders_foods ON foods.id = orders_foods.id_food
      WHERE foods.category = $1
      GROUP BY
        foods.id`,
      [category]
    );

    return foods;
  }

  public async findById(id: string): Promise<Food | null> {
    const [food] = await this.databaseConnection.query(
      `
      SELECT 
      foods.id,
      foods.food_name,
      foods.price,
      foods.description,
      foods.category,
      foods.image,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
              'id', orders_foods.id,
              'id_order', orders_foods.id_order,
              'id_food', orders_foods.id_food
          )
      ) FILTER (WHERE orders_foods.id IS NOT NULL), '[]' ) AS orders_foods
      FROM 
        foods
      LEFT JOIN
        orders_foods ON foods.id = orders_foods.id_food
      WHERE foods.id = $1
      GROUP BY
        foods.id
      `,
      [id]
    );

    if (!food) {
      return null;
    }

    return Food.restore(
      food.id,
      food.food_name,
      food.price,
      food.description,
      food.category,
      food.image,
      food.orders_foods
    );
  }

  public async findByName(food_name: string): Promise<Food | null> {
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
      food.image,
      food.orders_foods
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
