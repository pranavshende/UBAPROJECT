import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, StyleSheet, Platform, Text, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import HomeScreen from "../screens/HomeScreen";
import WeatherScreen from "../screens/WeatherScreen";
import ProfileScreen from "../screens/ProfileScreen";
import DiseaseScreen from "../screens/CameraScreen";
import CropRecommendation from "../screens/CropRecommendation"; // Added
import { MainTabParamList } from "./types";
import { COLORS, SHADOWS } from "../theme/Theme"; // Importing theme

const Tab = createBottomTabNavigator<MainTabParamList>();

type Props = {
  onLogout: () => void;
};

export default function MainTabs({ onLogout }: Props) {

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    onLogout();
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true, // Show labels for clarity
        tabBarActiveTintColor: COLORS.primaryDark,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginBottom: 4,
        },
        tabBarIcon: ({ focused, color, size }) => {
          // Special logic for Floating Button (Disease)
          if (route.name === "Disease") {
            return (
              <View style={styles.floatingButton}>
                <Image 
                  source={require("../assets/icons/TaskBar/DiseaseDetection.png")} 
                  style={{ width: 32, height: 32, tintColor: COLORS.white }} 
                  resizeMode="contain"
                />
              </View>
            );
          }

          let iconSource;
          if (route.name === "Home") {
            iconSource = require("../assets/icons/TaskBar/home.png");
          } else if (route.name === "Weather") {
            iconSource = require("../assets/icons/TaskBar/weather_t.png");
          } else if (route.name === "Profile") {
            iconSource = require("../assets/icons/TaskBar/Profile.png");
          } else if (route.name === "CropRecommendation") {
             // No icon in TaskBar folder, use vector
             return <Icon name={focused ? "sprout" : "sprout-outline"} size={26} color={color} />;
          }

          if (iconSource) {
             return (
               <Image 
                  source={iconSource} 
                  style={{ width: 26, height: 26, tintColor: color }} 
                  resizeMode="contain"
               />
             );
          }

          return <Icon name="help-circle" size={26} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen 
        name="CropRecommendation" 
        component={CropRecommendation} 
        options={{ tabBarLabel: 'Crops' }}
      />
      <Tab.Screen 
        name="Disease" 
        component={DiseaseScreen} 
        options={{ tabBarLabel: 'Scan', tabBarItemStyle: { marginTop: -20 } }} // Lift the label too? Or hide it?
      />
      <Tab.Screen name="Weather" component={WeatherScreen} />
      <Tab.Screen name="Profile">
        {(props) => (
          <ProfileScreen {...props} onLogout={handleLogout} />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    height: 70,
    backgroundColor: COLORS.surface,
    borderRadius: 35, // Rounded pill shape
    // SHADOWS.neumorphic might have backgroundColor too, so we need to be careful.
    shadowColor: SHADOWS.neumorphic.shadowColor,
    shadowOffset: SHADOWS.neumorphic.shadowOffset,
    shadowOpacity: SHADOWS.neumorphic.shadowOpacity,
    shadowRadius: SHADOWS.neumorphic.shadowRadius,
    elevation: SHADOWS.neumorphic.elevation,
    borderTopWidth: 0,
    paddingBottom: 5,
    paddingTop: 5,
  },
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40, // Push it up
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 4,
    borderColor: COLORS.background, 
  },
});
