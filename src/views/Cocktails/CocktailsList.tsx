import {
  Switch,
  VStack,
  HStack,
  Box,
  AddIcon,
  ButtonIcon,
  Input,
  InputField,
  InputSlot,
  Button,
  Center,
  Text,
  Heading,
} from "@gluestack-ui/themed";

import React, { type FC } from "react";
import { type NativeStackNavigationProp } from "@react-navigation/native-stack/";
import { type StackNavParamList } from "./CocktailsStack";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
type CocktailsListScreenNavigationProp = NativeStackNavigationProp<
  StackNavParamList,
  "CocktailsList"
>;
interface Props {
  navigation: CocktailsListScreenNavigationProp;
}
export const CocktailsList: FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <Box paddingHorizontal={25}>
        <Heading size="2xl" marginBottom={"$3"}>
          Cocktails
        </Heading>
        <HStack space="md" alignItems="center" marginBottom={"$5"}>
          <Input
            flex={1}
            variant="rounded"
            size="md"
            rounded={"$md"}
            borderColor="$primary300"
            borderWidth={2}
          >
            <InputSlot marginStart={10}>
              <FontAwesome name="search" color="#737373" size={15} />
            </InputSlot>
            <InputField placeholder="Search you cocktails" />
          </Input>
          <Button
            variant={"solid"}
            rounded={"$md"}
            size={"md"}
            bgColor="$primary400"
            shadowColor="$primary700"
            shadowOffset={{
              width: 0,
              height: 2,
            }}
            shadowOpacity={0.25}
            shadowRadius={5}
            hardShadow="4"
            elevation={0}
            gap={5}
            onPress={() => {
              navigation.navigate("CreateCocktail");
            }}
            aspectRatio={1}
            isDisabled={false}
          >
            <ButtonIcon as={AddIcon} size="xl" />
          </Button>
        </HStack>
        <Text>TODO: Cocktails List</Text>
      </Box>
    </SafeAreaView>
  );
};
