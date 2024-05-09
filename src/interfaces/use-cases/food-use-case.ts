interface FindAllFoodsUseCase {
  execute(): Promise<FoodProps[]>;
}

interface FindFoodByIdUseCase {
  execute(id: number): Promise<FoodProps>;
}

interface CreateFoodUseCase {
  execute(props: FoodProps): Promise<FoodProps>;
}

interface UpdateFoodUseCase {
  execute(props: FoodPropsWithId): Promise<FoodPropsWithId>;
}

interface DeleteFoodUseCase {
  execute(id: number): Promise<FoodPropsWithId>;
}

type FoodProps = {
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

type FoodPropsWithId = { id: number } & FoodProps;

export {
  FindAllFoodsUseCase,
  FindFoodByIdUseCase,
  CreateFoodUseCase,
  UpdateFoodUseCase,
  DeleteFoodUseCase,
  FoodProps,
  FoodPropsWithId,
};
