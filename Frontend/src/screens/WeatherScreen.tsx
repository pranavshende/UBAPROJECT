import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SHADOWS, SIZES } from '../theme/Theme';

const { width: screenWidth } = Dimensions.get('window');

// Scaling utility
const scale = (size: number) => (screenWidth / 375) * size;

// Shadow utility matching theme
const SHADOW = {
  shadowColor: '#BDC2BD',
  shadowOffset: { width: 5, height: 5 },
  shadowOpacity: 0.8,
  shadowRadius: 10,
  elevation: 5,
};

export default function WeatherScreen() {
  const [current, setCurrent] = useState<any>(null);
  const [daily, setDaily] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [city, setCity] = useState('Loading...');

  /* ---------- PERMISSION ---------- */
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

  /* ---------- FETCH WEATHER ---------- */
  const fetchWeather = async () => {
    try {
      setError(null);

      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setError('Location permission denied');
        setLoading(false);
        return;
      }

      Geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Fetch weather data from Open-Meteo API (free, no API key needed)
            const weatherResponse = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`
            );
            const weatherData = await weatherResponse.json();
            
            setCurrent({
              temperature: weatherData.current.temperature_2m,
              weathercode: weatherData.current.weathercode,
              windspeed: weatherData.current.windspeed_10m,
            });
            setDaily(weatherData.daily);
            
            // Reverse geocode to get city name with multiple fallbacks
            let cityName = 'Your Location';
            
            try {
              // Try OpenStreetMap Nominatim
              const geocodeResponse = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
                { headers: { 'User-Agent': 'FarmApp/1.0' } }
              );
              
              if (geocodeResponse.ok) {
                const geocodeData = await geocodeResponse.json();
                const address = geocodeData.address || {};
                cityName = address.city || address.town || address.village || address.county || address.state || 'Your Location';
                
                // Cache the location
                await AsyncStorage.setItem('lastKnownCity', cityName);
                await AsyncStorage.setItem('lastKnownLat', latitude.toString());
                await AsyncStorage.setItem('lastKnownLon', longitude.toString());
              } else {
                // Try to use cached location
                const cachedCity = await AsyncStorage.getItem('lastKnownCity');
                if (cachedCity) cityName = cachedCity;
              }
            } catch (error) {
              console.log('Geocoding error:', error);
              // Try to use cached location
              try {
                const cachedCity = await AsyncStorage.getItem('lastKnownCity');
                if (cachedCity) cityName = cachedCity;
              } catch {}
            }
            
            setCity(cityName);
            
            // Cache weather data for HomeScreen
            await AsyncStorage.setItem('weatherData', JSON.stringify({
              temperature: weatherData.current.temperature_2m,
              weathercode: weatherData.current.weathercode,
              windspeed: weatherData.current.windspeed_10m,
              lastUpdated: new Date().toISOString(),
            }));
            
            setLoading(false);
          } catch (err) {
            console.error('API Error:', err);
            setError('Failed to fetch weather data');
            setLoading(false);
          }
        },
        (err) => {
          console.error('Location Error:', err);
          setError('Unable to get location');
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } catch (err) {
      console.log("Error:", err);
      setError('An error occurred');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  /* ---------------- HELPERS ---------------- */
  const weatherLabel = (code: number) => {
    if (code <= 1) return 'Clear';
    if (code <= 3) return 'Partly Cloudy';
    if (code <= 48) return 'Foggy';
    if (code <= 67) return 'Rainy';
    if (code <= 77) return 'Snowy';
    if (code <= 99) return 'Thunderstorm';
    return 'Cloudy';
  };

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

  if (error) {
    return (
      <View style={styles.center}>
        <Icon name="alert-circle" size={64} color={COLORS.error} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchWeather}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!current || !daily) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No weather data available</Text>
      </View>
    );
  }

  const advisories = current ? getAdvisories(current.weathercode, current.windspeed) : [];
  
  // Prepare chart data for 5-day forecast
  const chartData = {
    labels: daily?.time.slice(0, 5).map((time: string) => 
      new Date(time).toLocaleDateString('en-US', { weekday: 'short' })
    ) || [],
    datasets: [{
      data: daily?.temperature_2m_max.slice(0, 5) || [0, 0, 0, 0, 0],
    }],
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Location Header */}
        <View style={styles.locationHeader}>
          <Icon name="map-marker" size={20} color={COLORS.primary} />
          <Text style={styles.locationText}>{city}</Text>
        </View>

        {/* Main Weather Card */}
        <View style={styles.mainCard}>
          <Text style={styles.temp}>{Math.round(current.temperature)}°C</Text>
          <Text style={styles.condition}>
            {weatherLabel(current.weathercode)}
          </Text>

          <View style={styles.row}>
            <Text style={styles.stat}>🌬 {current.windspeed} km/h</Text>
            <Text style={styles.stat}>☀️ Day Forecast</Text>
          </View>
        </View>

        {/* Temperature Overview */}
        <View style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Today's Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Icon name="thermometer" size={24} color={COLORS.primary} />
              <Text style={styles.statLabel}>Temperature</Text>
              <Text style={styles.statValue}>{Math.round(current.temperature)}°C</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="weather-windy" size={24} color={COLORS.primary} />
              <Text style={styles.statLabel}>Wind Speed</Text>
              <Text style={styles.statValue}>{current.windspeed} km/h</Text>
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
    paddingHorizontal: scale(20),
    paddingTop: 30,
    paddingBottom: scale(20),
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 20,
  },

  scrollContent: {
    paddingTop: 10,
  },

  /* ---------- LOCATION HEADER ---------- */
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },

  locationText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textMain,
  },

  /* ---------- ERROR STATE ---------- */
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    marginTop: 16,
    textAlign: 'center',
  },

  retryButton: {
    marginTop: 20,
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 25,
  },

  retryText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
  },

  /* ---------- MAIN CARD ---------- */
  mainCard: {
    backgroundColor: COLORS.white,
    borderRadius: scale(28),
    padding: scale(24),
    marginBottom: 20,
    ...SHADOW,
  },

  city: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textMain,
    marginBottom: 8,
  },

  temp: {
    fontSize: 56,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },

  condition: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },

  stat: {
    fontSize: 14,
    color: COLORS.textMain,
    fontWeight: '500',
  },

  /* ---------- STATS CARD ---------- */
  statsCard: {
    backgroundColor: COLORS.white,
    borderRadius: scale(20),
    padding: scale(20),
    marginBottom: 20,
    ...SHADOW,
  },

  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  statItem: {
    alignItems: 'center',
    gap: 8,
  },

  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },

  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textMain,
  },

  /* ---------- ADVISORY ---------- */
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textMain,
    marginBottom: 16,
    marginTop: 8,
  },

  advisoryCard: {
    backgroundColor: COLORS.white,
    borderRadius: scale(16),
    padding: 16,
    marginBottom: 12,
    ...SHADOW,
  },

  goodAdv: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
  },

  badAdv: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
  },

  advHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },

  advTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  advText: {
    color: COLORS.textSecondary,
    marginLeft: 40,
    fontSize: 14,
    lineHeight: 20,
  },

  /* ---------- FORECAST ---------- */
  forecastList: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    padding: 16,
    ...SHADOW,
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
    width: 80,
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
    fontSize: 15,
  },

  lowTemp: {
    color: COLORS.textSecondary,
    fontSize: 15,
  },
});
