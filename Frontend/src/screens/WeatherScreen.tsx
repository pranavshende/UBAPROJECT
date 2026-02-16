import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS, SHADOWS, SIZES } from "../theme/Theme";
import axios from "axios";
import Geolocation from 'react-native-geolocation-service';

export default function WeatherScreen() {
  const [current, setCurrent] = useState<any>(null);
  const [daily, setDaily] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState("Locating...");

  /* ---------------- FETCH WEATHER ---------------- */
  // Using Open-Meteo as it's free and no-key
  const fetchWeather = async () => {
    try {
      let lat = 18.5204; // Default Pune
      let lon = 73.8567;

      // Try getting location
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        Geolocation.getCurrentPosition(
            (position) => {
                lat = position.coords.latitude;
                lon = position.coords.longitude;
                getWeatherData(lat, lon);
            },
            (error) => {
                console.log(error);
                getWeatherData(lat, lon); // Fallback
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } else {
          getWeatherData(lat, lon);
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        return false;
      }
    }
    return true;
  };

  const getWeatherData = async (lat: number, lon: number) => {
      try {
        // Reverse Geocoding for name
        // (Optional, skipping for speed or using mock name if API fails)
        setLocationName(`${lat.toFixed(2)}, ${lon.toFixed(2)}`);

        const res = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum_daily,windspeed_10m_max&timezone=auto`
        );
        
        setCurrent(res.data.current_weather);
        setDaily(res.data.daily);
        setLoading(false);
      } catch (err) {
          console.log("API Error", err);
          setLoading(false);
      }
  }

  useEffect(() => {
    fetchWeather();
  }, []);

  /* ---------------- HELPERS ---------------- */
  const getWeatherIcon = (code: number) => {
      if (code <= 1) return 'weather-sunny';
      if (code <= 3) return 'weather-partly-cloudy';
      if (code <= 48) return 'weather-fog';
      if (code <= 67) return 'weather-rainy';
      if (code <= 77) return 'weather-snowy';
      if (code <= 99) return 'weather-lightning';
      return 'weather-cloudy';
  };

  const getAdvisories = (weatherCode: number, windSpeed: number) => {
      const advisories = [];
      
      // Spraying Logic
      if (weatherCode > 50 || windSpeed > 15) {
          advisories.push({
              type: 'bad',
              title: 'Avoid Spraying',
              text: 'High winds or rain expected. Chemicals may wash off.',
              icon: 'spray-bottle'
          });
      } else {
          advisories.push({
              type: 'good',
              title: 'Good for Spraying',
              text: 'Calm winds and no rain. Ideal for pesticides.',
              icon: 'spray-bottle'
          });
      }

      // Irrigation Logic
      if (weatherCode >= 51 && weatherCode <= 67) {
           advisories.push({
              type: 'bad',
              title: 'Skip Irrigation',
              text: 'Rainfall is expected today. Save water.',
              icon: 'water-off'
          });
      } else if (current?.temperature > 30) {
           advisories.push({
              type: 'good',
              title: 'Irrigate Crops',
              text: 'High temperatures detected. Crops need water.',
              icon: 'water'
          });
      }

      return advisories;
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const advisories = current ? getAdvisories(current.weathercode, current.windspeed) : [];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Main Weather Card */}
        <View style={styles.mainCard}>
            <View style={styles.headerRow}>
                <View>
                    {/* Placeholder for city name */}
                    <Text style={styles.city}>Pune District</Text> 
                    <Text style={styles.date}>{new Date().toDateString()}</Text>
                </View>
                <Icon name={getWeatherIcon(current?.weathercode)} size={60} color={COLORS.white} />
            </View>

            <View style={styles.tempContainer}>
                <Text style={styles.temp}>{Math.round(current?.temperature)}°</Text>
                <View style={styles.minMax}>
                    <Text style={styles.minMaxText}>Max: {Math.round(daily?.temperature_2m_max[0])}°</Text>
                    <Text style={styles.minMaxText}>Min: {Math.round(daily?.temperature_2m_min[0])}°</Text>
                </View>
            </View>
            
            <View style={styles.statsRow}>
                <View style={styles.stat}>
                    <Icon name="weather-windy" size={20} color={COLORS.primaryLight} />
                    <Text style={styles.statVal}>{current?.windspeed} km/h</Text>
                </View>
                <View style={styles.stat}>
                   <Icon name="water" size={20} color={COLORS.primaryLight} />
                   <Text style={styles.statVal}>{daily?.precipitation_sum_daily[0]} mm</Text>
                </View>
            </View>
        </View>

        {/* Farming Advisory */}
        <Text style={styles.sectionTitle}>Farming Advisory</Text>
        {advisories.map((adv, index) => (
            <View key={index} style={[styles.advisoryCard, adv.type === 'good' ? styles.goodAdv : styles.badAdv]}>
                <View style={styles.advHeader}>
                    <Icon 
                        name={adv.type === 'good' ? 'check-circle' : 'alert-circle'} 
                        size={28} 
                        color={adv.type === 'good' ? COLORS.success : COLORS.error} 
                    />
                    <Text style={[styles.advTitle, { color: adv.type === 'good' ? COLORS.success : COLORS.error }]}>
                        {adv.title}
                    </Text>
                </View>
                <Text style={styles.advText}>{adv.text}</Text>
            </View>
        ))}

        {/* 5-Day Forecast */}
        <Text style={styles.sectionTitle}>Week Ahead</Text>
        <View style={styles.forecastList}>
            {daily?.time.slice(1, 6).map((time: string, index: number) => (
                <View key={time} style={styles.forecastRow}>
                    <Text style={styles.dayText}>
                        {new Date(time).toLocaleDateString('en-US', { weekday: 'short' })}
                    </Text>
                    <Icon name={getWeatherIcon(daily.weathercode[index+1])} size={24} color={COLORS.textSecondary} />
                    <View style={styles.tempCol}>
                        <Text style={styles.highTemp}>{Math.round(daily.temperature_2m_max[index+1])}°</Text>
                        <Text style={styles.lowTemp}>{Math.round(daily.temperature_2m_min[index+1])}°</Text>
                    </View>
                </View>
            ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  scrollContent: {
    padding: SIZES.padding,
    paddingTop: 20,
  },
  mainCard: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusLg,
    padding: 24,
    marginBottom: 24,
    ...SHADOWS.float,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  city: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
  },
  date: {
    fontSize: 14,
    color: COLORS.primaryLight,
  },
  tempContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  temp: {
    fontSize: 64,
    fontWeight: '700',
    color: COLORS.white,
  },
  minMax: {
    flexDirection: 'row',
    gap: 16,
  },
  minMaxText: {
    fontSize: 16,
    color: COLORS.primaryLight,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statVal: {
    color: COLORS.white,
    fontWeight: '600',
  },

  /* ADVISORY */
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textMain,
    marginBottom: 12,
    marginTop: 8,
  },
  advisoryCard: {
    padding: 16,
    borderRadius: SIZES.radiusMd,
    marginBottom: 16,
    borderLeftWidth: 4,
    backgroundColor: COLORS.surface,
    ...SHADOWS.neumorphicLight,
  },
  goodAdv: {
    borderLeftColor: COLORS.success,
    backgroundColor: '#F1F8E9',
  },
  badAdv: {
    borderLeftColor: COLORS.error,
    backgroundColor: '#FFEBEE',
  },
  advHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  advTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  advText: {
    color: COLORS.textSecondary,
    marginLeft: 34,
    fontSize: 14,
    lineHeight: 20,
  },

  /* FORECAST */
  forecastList: {
    borderRadius: SIZES.radiusLg,
    padding: 16,
    ...SHADOWS.neumorphic,
  },
  forecastRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  dayText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textMain,
    width: 60,
  },
  tempCol: {
    flexDirection: 'row',
    gap: 10,
    width: 80,
    justifyContent: 'flex-end',
  },
  highTemp: {
    fontWeight: '700',
    color: COLORS.textMain,
  },
  lowTemp: {
    color: COLORS.textSecondary,
  },
});
