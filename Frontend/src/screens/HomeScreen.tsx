import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation, onLogout }: Props & any) {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    Alert.alert('Logged out');
    onLogout?.();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* LOGOUT BUTTON */}
      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* TITLE */}
      <Text style={styles.title}>🌱</Text>
      <Text style={styles.subtitle}>Your Smart Farming Companion</Text>

      {/* MAIN CARDS */}
      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardIcon}>🌾</Text>
          <Text style={styles.cardText}>Crop Recommendation</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Disease')}
        >
          <Text style={styles.cardIcon}>🦠</Text>
          <Text style={styles.cardText}>Disease Detection</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Weather')}
        >
          <Text style={styles.cardIcon}>🌦️</Text>
          <Text style={styles.cardText}>Weather Forecast</Text>
        </TouchableOpacity>

      </View>

      {/* BOTTOM NAV BAR */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem}>
          <Text style={styles.footerIcon}>🏠</Text>
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation.navigate('Disease')}
        >
          <Text style={styles.footerIcon}>📷</Text>
          <Text style={styles.footerText}>Scan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.footerIcon}>👤</Text>
          <Text style={styles.footerText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 70, // space for footer
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  subtitle: {
    fontSize: 16,
    color: '#2E7D32',
    marginBottom: 30,
  },
  cardContainer: {
    width: '90%',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 4,
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
  },

  /* LOGOUT */
  logout: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#C62828',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    zIndex: 10,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  /* BOTTOM BAR */
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 60,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#C8E6C9',
    elevation: 15,
  },
  footerItem: {
    alignItems: 'center',
  },
  footerIcon: {
    fontSize: 22,
  },
  footerText: {
    fontSize: 12,
    color: '#2E7D32',
    marginTop: 2,
  },
});
