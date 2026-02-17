import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStackParamList } from "./types";
import InitialScreen from "../screens/InitialScreen";
import ChangeLanguageScreen from "../screens/ChangeLanguageScreen";
import LoginScreen from "../screens/LoginScreen";
import AuthScreen from "../screens/AuthScreen";

const Stack = createNativeStackNavigator<AuthStackParamList>();

type Props = {
  onLoginSuccess: () => void;
};

export default function AuthNavigator({ onLoginSuccess }: Props) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Initial">
      <Stack.Screen name="Initial" component={InitialScreen} />
      <Stack.Screen name="ChangeLanguage" component={ChangeLanguageScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Auth">
        {(props) => <AuthScreen {...props} onLoginSuccess={onLoginSuccess} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
