import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import WeatherScreen from '../screens/WeatherScreen';
import CameraScreen from '../screens/CameraScreen';
import StudentInfoScreen from '../screens/StudentInfoScreen';


export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Weather: undefined;
  Camera: undefined;
  Crop: undefined;
  Disease: undefined;
  StudentInfo: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      id="RootStack"
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Weather" component={WeatherScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Disease" component={CameraScreen} />
      <Stack.Screen name="StudentInfo"component={StudentInfoScreen}/>

    </Stack.Navigator>
  );
}
