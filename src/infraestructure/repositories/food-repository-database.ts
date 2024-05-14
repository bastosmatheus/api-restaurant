import { Food } from "../../core/entities/food";
import { DatabaseConnection } from "../database/database-connection";
import { EFoodResponse, FoodRepository } from "../../adapters/repositories/food-repository";

class FoodRepositoryDatabase implements FoodRepository {
  constructor(private databaseConnection: DatabaseConnection) {}

  public async findAll(): Promise<Food[]> {
    const foods = await this.databaseConnection.query<Food>(/*sql*/ `SELECT * FROM foods`);

    return foods;
  }

  public async findFoodById(id: number): Promise<Food | EFoodResponse.FoodNotFound> {
    const [food] = await this.databaseConnection.query<Food>(
      /*sql*/ `SELECT * FROM foods WHERE id = ${id}`
    );

    if (!food) {
      return EFoodResponse.FoodNotFound;
    }

    return food;
  }

  public async findFoodByName(foodName: string): Promise<Food | EFoodResponse.FoodNotFound> {
    const [food] = await this.databaseConnection.query<Food>(
      /*sql*/ `SELECT * FROM foods WHERE food_name = ${foodName}`
    );

    if (!food) {
      return EFoodResponse.FoodNotFound;
    }

    return food;
  }

  public async create(foodRequest: Food): Promise<Food | EFoodResponse.FoodNameAlreadyExits> {
    const foodNameAlreadyExists = await this.findFoodByName(foodRequest.foodName);

    if (foodNameAlreadyExists) {
      return EFoodResponse.FoodNameAlreadyExits;
    }

    const [food] = await this.databaseConnection.query<Food>(
      /*sql*/ `INSERT INTO foods () VALUES (${(foodRequest.foodName, foodRequest.price, foodRequest.description, foodRequest.category, foodRequest.image)}) RETURNING *`
    );

    return food;
  }

  public async update(foodRequest: Food): Promise<Food> {
    throw new Error("Method not implemented.");
  }

  public async delete(id: number): Promise<Food | EFoodResponse.FoodNotFound> {
    const foodExists = await this.findFoodById(id);

    if (!foodExists) {
      return EFoodResponse.FoodNotFound;
    }

    const [food] = await this.databaseConnection.query<Food>(
      /*sql*/ `DELETE FROM foods WHERE id = ${id} RETURNING *`
    );

    return food;
  }
}

export { FoodRepositoryDatabase };
