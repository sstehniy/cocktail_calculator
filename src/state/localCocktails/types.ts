import { type Cocktail, type Ingredient } from "../../types";

export interface State {
  cocktails: Cocktail[];
  ingredients: Ingredient[];
}

export interface Actions {
  updateCocktail: (cocktail: Cocktail) => Promise<any>;
  createCocktail: (cocktail: Cocktail) => Promise<any>;
  deleteCocktail: (id: string) => Promise<any>;
  updateIngredient: (ingredient: Ingredient) => Promise<any>;
  createIngredient: (ingredient: Ingredient) => Promise<any>;
  deleteIngredient: (id: string) => Promise<any>;
  fetchInitialData: () => Promise<any>;
}
