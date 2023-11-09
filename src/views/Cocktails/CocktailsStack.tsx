import React, { type FC } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { CocktailsList } from "./CocktailsList";

import { type ParamListBase } from "@react-navigation/native";
import { CreateCocktail } from "./CreateCocktail";

export interface StackNavParamList extends ParamListBase {
  CocktailsList: undefined;
  CreateCocktail: undefined;
}

const Stack = createNativeStackNavigator<StackNavParamList>();

export const CocktailScreenStack: FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CocktailsList"
        component={CocktailsList}
        options={{
          headerShown: false,
          title: "Cocktails",
        }}
      />
      <Stack.Screen
        name="CreateCocktail"
        component={CreateCocktail}
        options={{
          headerShown: true,
          title: "Create a Cocktail",
        }}
      />
    </Stack.Navigator>
  );
};
