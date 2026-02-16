import { NavigatorScreenParams } from "@react-navigation/native";

/* ---------- AUTH ---------- */
export type AuthStackParamList = {
  Auth: undefined;
};

/* ---------- DISEASE STACK ---------- */
export type DiseaseStackParamList = {
  DiseaseHome: undefined;
  DiseaseCamera?: undefined;
  DiseaseResult?: { imageUri: string };
};

/* ---------- MAIN TABS ---------- */
export type MainTabParamList = {
  Home: undefined;
  Weather: undefined;
  Profile: undefined;

  // 👇 NEW
  Disease: undefined;
  CropRecommendation: undefined;
};

/* ---------- ROOT ---------- */
export type RootStackParamList = {
  AuthStack: NavigatorScreenParams<AuthStackParamList>;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
};
