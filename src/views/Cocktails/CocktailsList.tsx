import { type NativeStackNavigationProp } from "@react-navigation/native-stack/";
import React, { type FC } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalCocktailsStore } from "../../state/localCocktails/useLocalCocktailsStore";
import { type StackNavParamList } from "./CocktailsStack";
import {
  AddIcon,
  Box,
  ButtonIcon,
  Heading,
  HStack,
  Input,
  InputField,
  InputSlot,
  Button,
  FlatList,
} from "@gluestack-ui/themed";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import { type Cocktail } from "../../types";
import { CocktailItem } from "./CocktailItem";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

type CocktailsListScreenNavigationProp = NativeStackNavigationProp<
  StackNavParamList,
  "CocktailsList"
>;

interface Props {
  navigation: CocktailsListScreenNavigationProp;
}

const maxHeaderHeight = 110;

export const CocktailsList: FC<Props> = ({ navigation }) => {
  const { cocktails } = useLocalCocktailsStore();
  const insets = useSafeAreaInsets();
  const maxHeight = useSharedValue(maxHeaderHeight);
  const opacity = useSharedValue(1);

  const scrollHanler = useAnimatedScrollHandler((event) => {
    const scrollValue = event.contentOffset.y;

    const scrollValueRange = 100;
    const scrollValuePercent = scrollValue / scrollValueRange;

    const scrollValuePercentClamped = Math.min(
      Math.max(scrollValuePercent, 0),
      1,
    );

    const scrollValueMapped = maxHeaderHeight * scrollValuePercentClamped;

    const opacityValue = 1 - scrollValuePercentClamped;
    maxHeight.value = maxHeaderHeight - scrollValueMapped;
    opacity.value = opacityValue;
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
      maxHeight: maxHeight.value,
      opacity: opacity.value,
    };
  });

  return (
    <Box flex={1} paddingTop={insets.top}>
      <Animated.View style={[headerStyle]}>
        <Heading size="2xl" marginBottom={"$2"} paddingHorizontal={15}>
          Cocktails
        </Heading>
        <HStack
          space="md"
          alignItems="center"
          marginBottom={"$4"}
          paddingHorizontal={15}
        >
          <Input
            flex={1}
            variant="rounded"
            size="xl"
            rounded={"$full"}
            borderColor="$purple600"
            borderWidth={1}
          >
            <InputSlot marginStart={20}>
              <FontAwesome name="search" color="#737373" size={15} />
            </InputSlot>
            <InputField placeholder="Search you cocktails" size="md" />
          </Input>
          <Button
            variant={"solid"}
            rounded={"$full"}
            size={"lg"}
            bgColor="$purple600"
            shadowOffset={{
              width: 0,
              height: 2,
            }}
            shadowOpacity={0.25}
            shadowRadius={4}
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
      </Animated.View>
      <WrappedFlatList
        backgroundColor={"$coolGray100"}
        data={cocktails}
        showsVerticalScrollIndicator={false}
        renderItem={(item) => {
          const data = (item as any).item as Cocktail;
          return <CocktailItem cocktail={data} navigation={navigation} />;
        }}
        style={{
          paddingHorizontal: 15,
        }}
        keyExtractor={(item) => (item as Cocktail).id}
        onScroll={scrollHanler}
        scrollEventThrottle={16}
      />
    </Box>
  );
};

const WrappedFlatList = Animated.createAnimatedComponent(FlatList);
