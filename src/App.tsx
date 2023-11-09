import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  type ParamListBase,
} from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import { CocktailScreenStack } from "./views/Cocktails/CocktailsStack";
import { IngredientScreen } from "./views/Ingredients";
import { useLocalCocktailsStore } from "./state/localCocktails/useLocalCocktailsStore";
import {
  useFonts,
  Roboto_300Light,
  Roboto_100Thin,
  Roboto_100Thin_Italic,
  Roboto_300Light_Italic,
  Roboto_400Regular,
  Roboto_400Regular_Italic,
  Roboto_500Medium,
  Roboto_500Medium_Italic,
  Roboto_700Bold,
  Roboto_700Bold_Italic,
  Roboto_900Black,
  Roboto_900Black_Italic,
} from "@expo-google-fonts/roboto/";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { config as defaultConfig } from "@gluestack-ui/config";
import { GluestackUIProvider } from "@gluestack-ui/themed";

export interface TabNavParamList extends ParamListBase {
  Cocktails: undefined;
  Ingredients: undefined;
}

const Tab = createBottomTabNavigator<TabNavParamList>();

export default function App() {
  const { fetchInitialData } = useLocalCocktailsStore();

  const [fontsLoaded] = useFonts({
    Roboto_100Thin,
    Roboto_100Thin_Italic,
    Roboto_300Light,
    Roboto_300Light_Italic,
    Roboto_400Regular,
    Roboto_400Regular_Italic,
    Roboto_500Medium,
    Roboto_500Medium_Italic,
    Roboto_700Bold,
    Roboto_700Bold_Italic,
    Roboto_900Black,
    Roboto_900Black_Italic,
  });

  useEffect(() => {
    void (async () => {
      try {
        await fetchInitialData();
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GluestackUIProvider config={defaultConfig}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerStyle: {},
            headerShown: false,
          }}
        >
          <Tab.Screen
            name="Cocktails"
            component={CocktailScreenStack}
            options={{
              tabBarIcon: ({ color, size }) => (
                <FontAwesome name="cocktail" color={color} size={size} />
              ),
              tabBarActiveTintColor: "#1A91FF",
              tabBarInactiveTintColor: "#737373",
            }}
          />
          <Tab.Screen
            name="Ingredients"
            component={IngredientScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <FontAwesome name="clipboard-list" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </GluestackUIProvider>
  );
}
