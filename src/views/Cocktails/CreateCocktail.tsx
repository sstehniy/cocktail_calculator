import { Box } from "@gluestack-ui/themed";
import { type NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { type FC } from "react";
import { type StackNavParamList } from "./CocktailsStack";

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
