import React from "react";
import { type NativeStackNavigationProp } from "@react-navigation/native-stack";
import { type StackNavParamList } from "./CocktailsStack";
import { type FC } from "react";
import { Box, FormControl } from "@gluestack-ui/themed";

type CreateCocktailScreenNavigationProp = NativeStackNavigationProp<
  StackNavParamList,
  "CreateCocktail"
>;

interface Props {
  navigation: CreateCocktailScreenNavigationProp;
}

export const CreateCocktail: FC<Props> = ({ navigation }) => {
  return <Box flex={1} padding={7}></Box>;
};
