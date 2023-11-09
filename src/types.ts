// cocktails saved in local db

export interface Cocktail {
  id: string;
  name: string;
  description: string;
  ingredients: CocktailIngredient[];
  image: string;
}

export interface Ingredient {
  id: string;
  name: string;
  image: string;
}

export interface CocktailIngredient extends Ingredient {
  amountPerCocktail: number;
  unit: string;
  amountInMl: number;
  pricePerLiter: number;
}

// Cocktails statically saved

export interface SearchCocktail {
  id: string;
  image: string;
  garnish: string;
  boozy: number;
  drySour: number;
  preparation: string;
  ingredients: SearchCocktailIngredient[];
}

export interface SearchCocktailIngredient extends Ingredient {
  amountPerCocktail: number;
  unit: string;
}
