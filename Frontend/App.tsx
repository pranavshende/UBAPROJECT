import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";

import { LanguageProvider } from "./src/i18n/LanguageContexts";
import MainTabs from "./src/navigation/MainTabs";
import AuthScreen from "./src/screens/AuthScreen";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("token");
      setIsLoggedIn(!!token);
      setLoading(false);
    };
    checkLogin();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <LanguageProvider>
      <NavigationContainer>
        {isLoggedIn ? (
          <MainTabs onLogout={() => setIsLoggedIn(false)} />
        ) : (
          <AuthScreen onLoginSuccess={() => setIsLoggedIn(true)} />
        )}
      </NavigationContainer>
    </LanguageProvider>
  );
}
