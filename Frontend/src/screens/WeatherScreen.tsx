import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';

/* ---------- TYPES ---------- */
interface CurrentWeather {
  temperature: number;
  windspeed: number;
  weathercode: number;
}

interface DailyForecast {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weathercode: number[];
}

const screenWidth = Dimensions.get('window').width;

const { width, height } = Dimensions.get('window');
const scale = (size: number): number => (width / 375) * size;

export default function WeatherScreen() {
  const navigation = useNavigation<any>();

  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [daily, setDaily] = useState<DailyForecast | null>(null);
  const [city, setCity] = useState('Loading...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  /* ---------- PERMISSION ---------- */
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
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
        async ({ coords }) => {
          const { latitude, longitude } = coords;

          const weatherRes = await axios.get(
            'https://api.open-meteo.com/v1/forecast',
            {
              params: {
                latitude,
                longitude,
                current_weather: true,
                daily: 'temperature_2m_max,temperature_2m_min,weathercode',
                timezone: 'auto',
              },
            }
          );

          setCurrent(weatherRes.data.current_weather);
          setDaily(weatherRes.data.daily);

          const geoRes = await axios.get(
            'https://api.bigdatacloud.net/data/reverse-geocode-client',
            {
              params: { latitude, longitude, localityLanguage: 'en' },
            }
          );

          setCity(
            geoRes.data.city ||
              geoRes.data.locality ||
              geoRes.data.principalSubdivision ||
              'Your Location'
          );

          setLoading(false);
          setRefreshing(false);
        },
        () => {
          setError('Unable to fetch location');
          setLoading(false);
          setRefreshing(false);
        },
        { enableHighAccuracy: true }
      );
    } catch {
      setError('Failed to fetch weather');
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWeather();
  };

  /* ---------- HELPERS ---------- */
  const weatherLabel = (code: number) => {
    if (code === 0) return 'Clear';
    if (code <= 3) return 'Cloudy';
    if (code <= 48) return 'Fog';
    if (code <= 67) return 'Rain';
    if (code <= 77) return 'Snow';
    return 'Storm';
  };

  const formatDay = (date: string) =>
    new Date(date).toLocaleDateString('en-IN', {
      weekday: 'short',
    });

  /* ---------- UI STATES ---------- */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text>Fetching weather…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <Text style={styles.retry} onPress={fetchWeather}>
          Retry
        </Text>
      </View>
    );
  }

  if (!current || !daily) return null;

  /* ---------- CHART DATA ---------- */
  const chartData = {
    labels: daily.time.slice(1, 6).map(formatDay),
    datasets: [
      {
        data: daily.temperature_2m_max.slice(1, 6),
        strokeWidth: 3,
      },
    ],
  };

  return (
    <View style={styles.screen}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Weather</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* CURRENT WEATHER CARD */}
        <View style={styles.mainCard}>
          <Text style={styles.city}>{city}</Text>
          <Text style={styles.temp}>{Math.round(current.temperature)}°C</Text>
          <Text style={styles.condition}>
            {weatherLabel(current.weathercode)}
          </Text>

          <View style={styles.row}>
            <Text style={styles.stat}>🌬 {current.windspeed} km/h</Text>
            <Text style={styles.stat}>☀️ Day Forecast</Text>
          </View>
        </View>

        {/* LINE CHART */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>5-Day Temperature Trend</Text>

          <LineChart
            data={chartData}
            width={screenWidth - 40}
            height={220}
            yAxisSuffix="°"
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: () => '#2E7D32',
              labelColor: () => '#1B5E20',
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#1B5E20',
              },
            }}
            bezier
            style={{ borderRadius: 16 }}
          />
        </View>

        {/* FORECAST LIST */}
        <View style={styles.forecastCard}>
          <Text style={styles.forecastTitle}>Next 5 Days</Text>

          {daily.time.slice(1, 6).map((day, index) => (
            <View key={day} style={styles.forecastRow}>
              <Text style={styles.day}>{formatDay(day)}</Text>
              <Text style={styles.range}>
                {Math.round(daily.temperature_2m_min[index + 1])}° /{' '}
                {Math.round(daily.temperature_2m_max[index + 1])}°
              </Text>
              <Text style={styles.label}>
                {weatherLabel(daily.weathercode[index + 1])}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

/* ---------- STYLES ---------- */
const COLORS = {
  bg: '#EAF6EC',
  primary: '#1B5E20',
  secondary: '#2E7D32',
  accent: '#4CAF50',
  muted: '#81C784',
  white: '#FFFFFF',
  error: '#C62828',
  divider: '#E0E0E0',
};

const SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 6,
  elevation: 6,
};

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  container: {
    paddingHorizontal: scale(20),
    paddingBottom: scale(20),
  },

  /* ---------- HEADER ---------- */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    paddingVertical: scale(30),
  },

  back: {
    fontSize: scale(24),
    color: COLORS.primary,
  },

  headerTitle: {
    fontSize: scale(20),
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },

  /* ---------- MAIN WEATHER CARD ---------- */
  mainCard: {
    backgroundColor: COLORS.white,
    borderRadius: scale(24),
    paddingVertical: scale(28),
    paddingHorizontal: scale(22),
    alignItems: 'center',
    marginTop: scale(10),
    ...SHADOW,
  },

  city: {
    fontSize: scale(20),
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: scale(4),
  },

  temp: {
    fontSize: scale(64),
    fontWeight: '800',
    color: COLORS.secondary,
    marginVertical: scale(6),
  },

  condition: {
    fontSize: scale(16),
    color: COLORS.accent,
    marginBottom: scale(10),
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: scale(12),
  },

  stat: {
    fontSize: scale(14),
    color: COLORS.secondary,
    fontWeight: '600',
  },

  label: {
    fontSize: scale(12),
    color: COLORS.muted,
    textAlign: 'center',
    marginTop: scale(2),
  },

  /* ---------- CHART CARD ---------- */
chartCard: {
  marginTop: scale(20),
  backgroundColor: COLORS.white,
  borderRadius: scale(22),
  paddingTop: scale(16),
  paddingHorizontal: scale(0),
  paddingBottom: scale(18),
  overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
  ...SHADOW,
},

chartTitle: {
  fontSize: scale(16),
  fontWeight: '700',
  color: COLORS.primary,
  textAlign: 'center',
  marginBottom: scale(10),
  letterSpacing: 0.3,
},

/* IMPORTANT: chart container */
chartContainer: {
  height: scale(220),          // 🔥 REQUIRED
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
},

  /* ---------- FORECAST CARD ---------- */
  forecastCard: {
    marginTop: scale(20),
    backgroundColor: COLORS.white,
    borderRadius: scale(20),
    padding: scale(18),
    ...SHADOW,
  },

  forecastTitle: {
    fontSize: scale(16),
    fontWeight: '700',
    marginBottom: scale(10),
    color: COLORS.primary,
  },

  forecastRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scale(10),
    borderBottomWidth: 0.6,
    borderBottomColor: COLORS.divider,
  },

  day: {
    fontSize: scale(14),
    fontWeight: '600',
    color: COLORS.primary,
  },

  range: {
    fontSize: scale(14),
    color: COLORS.secondary,
    fontWeight: '500',
  },

  /* ---------- STATES ---------- */
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  error: {
    color: COLORS.error,
    fontSize: scale(14),
    fontWeight: '600',
  },

  retry: {
    marginTop: scale(12),
    color: COLORS.secondary,
    fontSize: scale(15),
    fontWeight: '700',
  },
});
