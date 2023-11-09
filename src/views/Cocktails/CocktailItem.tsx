import React, { type FC } from "react";
import { type StackNavParamList } from "./CocktailsStack";
import { type NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Box, Text } from "@gluestack-ui/themed";
import { type Cocktail } from "../../types";

type CocktailsListScreenNavigationProp = NativeStackNavigationProp<
  StackNavParamList,
  "CocktailsList"
>;

interface Props {
  cocktail: Cocktail;
  navigation: CocktailsListScreenNavigationProp;
}

export const CocktailItem: FC<Props> = ({ cocktail, navigation }) => {
  return (
    <Box>
      <Text>{cocktail.name}</Text>
    </Box>
  );
};
