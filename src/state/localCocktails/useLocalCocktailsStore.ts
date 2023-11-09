import { create } from "zustand";
import { type Actions, type State } from "./types";
import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";
import {
  type Ingredient,
  type Cocktail,
  type CocktailIngredient,
} from "../../types";

function openDatabase() {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }

  const db = SQLite.openDatabase("cocktails.db");
  db.transaction((tx) => {
    // drop all tables

    tx.executeSql("DROP TABLE IF EXISTS cocktails");
    tx.executeSql("DROP TABLE IF EXISTS ingredients");
    tx.executeSql("DROP TABLE IF EXISTS cocktail_ingredients");

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS cocktails (
        id TEXT PRIMARY KEY NOT NULL, 
        name TEXT, 
        description TEXT, 
        image TEXT
        )`,
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS ingredients (
        id TEXT PRIMARY KEY NOT NULL, 
        name TEXT, 
        image TEXT
        )`,
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS cocktail_ingredients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cocktail_id TEXT NOT NULL,
        ingredient_id TEXT NOT NULL, 
        amount REAL, 
        unit TEXT, 
        amount_per_cocktail REAL, 
        FOREIGN KEY (cocktail_id) REFERENCES cocktails(id),
        FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
        )`,
    );

    tx.executeSql(`
INSERT INTO cocktails (id, name, description, image) VALUES 
('cocktail-001', 'Mojito', 'A traditional Cuban highball', 'https://cdn.diffords.com/contrib/stock-images/2016/1/01/20163e856fbeb76b298eb064a15897d2b5d6.jpg'),
('cocktail-002', 'Cosmopolitan', 'A chic, classic cocktail', 'https://cdn.diffords.com/contrib/stock-images/2016/7/58/201617fbd06027f8d8e70378b3dadb8a275e.jpg'),
('cocktail-003', 'Margarita', 'A popular Mexican cocktail', 'https://cdn.diffords.com/contrib/stock-images/2023/02/63fe29aa8c69b.jpg');
    `);

    tx.executeSql(`
    INSERT INTO cocktail_ingredients (cocktail_id, ingredient_id, 
amountPerCocktail, unit, amountInMl, pricePerLiter) VALUES 
('cocktail-001', 'ing-001', 50, 'ml', 1000, 20),
('cocktail-001', 'ing-002', 8, 'leaves', 100, 30),
('cocktail-001', 'ing-003', 25, 'ml', 1000, 20),
('cocktail-001', 'ing-004', 2, 'teaspoons', 100, 30),
('cocktail-001', 'ing-005', 100, 'ml', 1000, 20),
('cocktail-002', 'ing-006', 35, 'ml', 1000, 20),
('cocktail-002', 'ing-007', 15, 'ml', 1000, 20),
('cocktail-002', 'ing-008', 15, 'ml', 1000, 20),
('cocktail-002', 'ing-003', 25, 'ml', 1000, 20),
    `);

    tx.executeSql(
      `INSERT INTO ingredients (id, name, image) VALUES 
('ing-001', 'White Rum', 'white_rum.jpg'),
('ing-002', 'Mint Leaves', 'mint_leaves.jpg'),
('ing-003', 'Lime Juice', 'lime_juice.jpg'),
('ing-004', 'Sugar', 'sugar.jpg'),
('ing-005', 'Soda Water', 'soda_water.jpg'),
('ing-006', 'Vodka', 'vodka.jpg'),
('ing-007', 'Triple Sec', 'triple_sec.jpg'),
('ing-008', 'Cranberry Juice', 'cranberry_juice.jpg'),
('ing-009', 'Tequila', 'tequila.jpg'),
('ing-010', 'Salt', 'salt.jpg');`,
    );
  });

  return db;
}

const db = openDatabase();

const executeSql = async (sql: string, params: any[] = []) =>
  await new Promise<SQLite.SQLResultSet>((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          sql,
          params,
          (_, result) => {
            resolve(result);
          },
          (_, error) => {
            console.error(`Failed to execute query: ${sql}`, error);
            reject(error);
            return false; // to indicate error handled
          },
        );
      },
      (error) => {
        console.error("Transaction error:", error);
        reject(error);
      },
    );
  });

export const useLocalCocktailsStore = create<State & Actions>()((set, get) => ({
  cocktails: [],
  ingredients: [],
  updateCocktail: async (cocktail) => {
    try {
      await executeSql(
        "UPDATE cocktails SET name = ?, description = ?,  image = ? WHERE id = ?",
        [cocktail.name, cocktail.description, cocktail.image, cocktail.id],
      );
      await executeSql(
        "DELETE FROM cocktail_ingredients WHERE cocktail_id = ?",
        [cocktail.id],
      );

      const ingredientInserts = cocktail.ingredients.map(
        async (ingredient) =>
          await executeSql(
            "INSERT INTO cocktail_ingredients (cocktail_id, ingredient_id, amount, unit, amount_per_cocktail) VALUES (?, ?, ?, ?, ?)",
            [
              cocktail.id,
              ingredient.id,
              ingredient.amountInMl,
              ingredient.unit,
              ingredient.amountPerCocktail,
            ],
          ),
      );

      await Promise.all(ingredientInserts);

      const newIngredients = get().ingredients.filter(
        (i) =>
          cocktail.ingredients.find((ingredient) => ingredient.id === i.id) ===
          undefined,
      );

      const ingredientInserts2 = newIngredients.map(
        async (ingredient) =>
          await executeSql(
            "INSERT INTO ingredients (id, name, image) VALUES (?, ?,?)",
            [ingredient.id, ingredient.name],
          ),
      );

      await Promise.all(ingredientInserts2);

      const getAllIngredients = await executeSql(
        "SELECT * FROM ingredients",
        [],
      );

      set(() => ({
        cocktails: get().cocktails.map((c) =>
          c.id === cocktail.id ? cocktail : c,
        ),
        ingredients: getAllIngredients.rows._array as Ingredient[],
      }));
    } catch (error) {
      console.error("Failed to update cocktail:", error);
    }
  },
  createCocktail: async (cocktail) => {
    const { ingredients, ...rest } = cocktail;
    try {
      await executeSql(
        "INSERT INTO cocktails (id, name, description, image) VALUES (?, ?, ?, ?)",
        [rest.id, rest.name, rest.description, rest.image],
      );
      await Promise.all(
        ingredients.map(async (ingredient) => {
          await executeSql(
            "INSERT INTO cocktail_ingredients (cocktail_id, ingredient_id, amount, unit, amount_per_cocktail) VALUES (?, ?, ?, ?, ?)",
            [
              cocktail.id,
              ingredient.id,
              ingredient.amountInMl,
              ingredient.unit,
              ingredient.amountPerCocktail,
            ],
          );
        }),
      );
      const newIngredients = get().ingredients.filter(
        (i) =>
          cocktail.ingredients.find((ingredient) => ingredient.id === i.id) ===
          undefined,
      );

      const ingredientInserts = newIngredients.map(
        async (ingredient) =>
          await executeSql(
            "INSERT INTO ingredients (id, name, image) VALUES (?, ?, ?)",
            [ingredient.id, ingredient.name, ingredient.image],
          ),
      );

      await Promise.all(ingredientInserts);

      const getAllIngredients = await executeSql(
        "SELECT * FROM ingredients",
        [],
      );

      set(() => ({
        ingredients: getAllIngredients.rows._array as Ingredient[],
        cocktails: [...get().cocktails, cocktail],
      }));
    } catch (err) {
      console.log("Failed to create cocktail:", err);
    }
  },
  getAllCocktails: async () => {
    try {
      const cocktails = await executeSql("SELECT * FROM cocktails", []);
      const cocktailsWithIngredients = (await Promise.all(
        cocktails.rows._array.map(async (cocktail) => {
          const ingredients = await executeSql(
            "SELECT * FROM cocktail_ingredients WHERE cocktail_id = ?",
            [cocktail.id],
          );
          return {
            ...cocktail,
            ingredients: ingredients.rows._array,
          };
        }),
      )) as Cocktail[];
      set({
        cocktails: cocktailsWithIngredients,
      });
    } catch (err) {
      console.log("Failed to get all cocktails:", err);
    }
  },
  deleteCocktail: async (id) => {
    try {
      await executeSql("DELETE FROM cocktails WHERE id = ?", [id]);
      await executeSql(
        "DELETE FROM cocktail_ingredients WHERE cocktail_id = ?",
        [id],
      );
      set({
        cocktails: get().cocktails.filter((c) => c.id !== id),
      });
    } catch (err) {
      console.log("Failed to delete cocktail:", err);
    }
  },
  createIngredient: async (ingredient) => {
    try {
      await executeSql(
        "INSERT INTO ingredients (id, name, image) VALUES (?, ?, ?)",
        [ingredient.id, ingredient.name, ingredient.image],
      );
      set({
        ingredients: [...get().ingredients, ingredient],
      });
    } catch (err) {
      console.log("Failed to create ingredient:", err);
    }
  },
  updateIngredient: async (ingredient) => {
    try {
      await executeSql(
        "UPDATE ingredients SET name = ?, image = ? WHERE id = ?",
        [ingredient.name, ingredient.id, ingredient.image],
      );

      set({
        ingredients: get().ingredients.map((i) =>
          i.id === ingredient.id ? ingredient : i,
        ),
      });
    } catch (err) {
      console.log("Failed to update ingredient:", err);
    }
  },
  deleteIngredient: async (id) => {
    try {
      await executeSql("DELETE FROM ingredients WHERE id = ?", [id]);
      await executeSql(
        "DELETE FROM cocktail_ingredients WHERE ingredient_id = ?",
        [id],
      );
      set({
        ingredients: get().ingredients.filter((i) => i.id !== id),
      });
    } catch (err) {
      console.log("Failed to delete ingredient:", err);
    }
  },
  fetchInitialData: async () => {
    try {
      const { rows: cocktailRows } = await executeSql(
        `SELECT 
  c.id AS 'id', 
  c.name AS 'name', 
  c.description AS 'description', 
  c.instructions AS 'instructions', 
  c.image AS 'image',
  json_group_array(
    json_object(
      'id', ci.ingredient_id, 
      'name', i.name, 
      'image', i.image, 
      'amount', ci.amount, 
      'unit', ci.unit
    )
  ) AS 'ingredients'
FROM 
  cocktails c
LEFT JOIN 
  cocktail_ingredients ci ON c.id = ci.cocktail_id
LEFT JOIN 
  ingredients i ON ci.ingredient_id = i.id
GROUP BY 
  c.id;

        `,
      );

      // Convert the map into an array of cocktails

      const { rows: ingredientRows } = await executeSql(
        "SELECT * FROM ingredients",
      );
      const cocktails = cocktailRows._array.map((val) => ({
        ...val,
        ingredients: JSON.parse(val.ingredients),
      })) as Cocktail[];
      const ingredients = ingredientRows._array as Ingredient[];
      console.log("cocktails", cocktails);

      set({
        cocktails,
        ingredients,
      });
    } catch (err) {
      console.log("Failed to fetch initial data:", err);
    }
  },
}));
