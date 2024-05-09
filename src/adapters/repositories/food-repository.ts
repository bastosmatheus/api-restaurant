import { FoodProps, FoodPropsWithId } from "../../interfaces/use-cases/food-use-case";

interface FoodRepository {
  findAll(): Promise<FoodProps[]>;
  findFoodById(id: number): Promise<FoodPropsWithId>;
  create(props: FoodProps): Promise<FoodProps>;
  update(props: FoodPropsWithId): Promise<FoodPropsWithId>;
  delete(id: number): Promise<FoodPropsWithId>;
}

export { FoodRepository };
