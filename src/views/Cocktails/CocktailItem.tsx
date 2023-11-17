import React, { type FC } from "react";
import { type StackNavParamList } from "./CocktailsStack";
import { type NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Avatar,
  AvatarImage,
  Box,
  HStack,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { type Cocktail } from "../../types";
import { TouchableOpacity } from "react-native";

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
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("CocktailDetails", {
          cocktail,
        });
      }}
    >
      <Box
        shadowRadius={3}
        shadowOpacity={0.25}
        shadowOffset={{
          width: 0,
          height: 1,
        }}
        shadowColor="$trueGray500"
        rounded={"$xl"}
        backgroundColor="$white"
        marginBottom={"$3.5"}
        padding="$2.5"
      >
        <HStack alignItems="stretch" space="md">
          <Avatar rounded={"$full"}>
            <AvatarImage source={{ uri: cocktail.image }} rounded={"$sm"} />
          </Avatar>
          <VStack flex={1}>
            <Text
              color="$coolGray800"
              fontWeight="$bold"
              fontSize={"$lg"}
              marginBottom={"$1"}
              sx={{
                _dark: {
                  color: "$warmGray100",
                },
              }}
            >
              {cocktail.name}
            </Text>
            <Text
              color="$coolGray600"
              sx={{
                _dark: {
                  color: "$warmGray200",
                },
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
              size="sm"
            >
              alkfsjdlfkjadlg;k jadlkfj lkas jflk;asdj fl;k jadskl; fjakl;d
              jf;lka jdklfa kl;dsj fl;kasdj f;klasdj fl;kj sad;ldkfj asd;lkj
            </Text>
          </VStack>
        </HStack>
      </Box>
    </TouchableOpacity>
  );
};
