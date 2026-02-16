import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  PermissionsAndroid,
  Platform,
} from "react-native";
import Geolocation from 'react-native-geolocation-service';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import { COLORS, SHADOWS, SIZES } from "../theme/Theme";
import { useLanguage } from "../i18n/LanguageContexts";
import { MainTabParamList } from "../navigation/types";

type HomeScreenNavigationProp = NativeStackNavigationProp<MainTabParamList, "Home">;

const ActionButton = ({ 
  icon,
  image, 
  label, 
  onPress, 
  color = COLORS.primary 
}: { 
  icon?: string,
  image?: any,
  label: string, 
  onPress: () => void, 
  color?: string 
}) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <View style={[styles.iconWrapper, { backgroundColor: color + '20' }]}> 
      {image ? (
        <Image source={image} style={{ width: 32, height: 32 }} resizeMode="contain" />
      ) : (
        <Icon name={icon!} size={32} color={color} />
      )}
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);


export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { t } = useLanguage();
  const [greeting, setGreeting] = useState("");
  const [userName, setUserName] = useState("Farmer");
  const [location, setLocation] = useState("Your Location");
  const [weatherData, setWeatherData] = useState({
    temperature: 25,
    weathercode: 0,
    windspeed: 0,
  });
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting(t.goodMorning);
    else if (hours < 18) setGreeting(t.goodAfternoon);
    else setGreeting(t.goodEvening);

    const fetchUser = async () => {
      try {
         // Using the same endpoint as ProfileScreen
         const token = await AsyncStorage.getItem("token");
         if (token) {
            const res = await fetch("http://192.168.1.2:5000/api/auth/profile", {
               headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.user && data.user.name) {
              setUserName(data.user.name);
            }
         }
      } catch (e) {
         console.log("Failed to fetch user name");
      }
    };
    
    const fetchLocation = async () => {
      try {
        const cachedCity = await AsyncStorage.getItem('lastKnownCity');
        if (cachedCity) {
          setLocation(cachedCity);
        }
        
        // Try to fetch weather data from cache first
        const cachedWeather = await AsyncStorage.getItem('weatherData');
        if (cachedWeather) {
          const weather = JSON.parse(cachedWeather);
          setWeatherData({
            temperature: weather.temperature,
            weathercode: weather.weathercode,
            windspeed: weather.windspeed,
          });
          setWeatherLoading(false);
        }
      } catch (e) {
        console.log("Failed to fetch cached data");
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
    
    const fetchWeatherData = async () => {
      try {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
          setWeatherLoading(false);
          return;
        }

        Geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            
            try {
              // Fetch weather data from Open-Meteo API
              const weatherResponse = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode,windspeed_10m&timezone=auto`
              );
              const weatherData = await weatherResponse.json();
              
              const newWeatherData = {
                temperature: weatherData.current.temperature_2m,
                weathercode: weatherData.current.weathercode,
                windspeed: weatherData.current.windspeed_10m,
              };
              
              setWeatherData(newWeatherData);
              
              // Cache the data
              await AsyncStorage.setItem('weatherData', JSON.stringify({
                ...newWeatherData,
                lastUpdated: new Date().toISOString(),
              }));
              
              // Get city name
              try {
                const geocodeResponse = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
                  { headers: { 'User-Agent': 'FarmApp/1.0' } }
                );
                
                if (geocodeResponse.ok) {
                  const geocodeData = await geocodeResponse.json();
                  const address = geocodeData.address || {};
                  const cityName = address.city || address.town || address.village || address.county || address.state || 'Your Location';
                  setLocation(cityName);
                  await AsyncStorage.setItem('lastKnownCity', cityName);
                }
              } catch (error) {
                console.log('Geocoding error:', error);
              }
              
              setWeatherLoading(false);
            } catch (err) {
              console.error('Weather API Error:', err);
              setWeatherLoading(false);
            }
          },
          (err) => {
            console.error('Location Error:', err);
            setWeatherLoading(false);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } catch (err) {
        console.log("Weather fetch error:", err);
        setWeatherLoading(false);
      }
    };
    
    fetchUser();
    fetchLocation();
    fetchWeatherData(); // Fetch fresh weather data on load
  }, []);

  // Helper functions for weather display
  const getWeatherIcon = (code: number) => {
    if (code <= 1) return 'weather-sunny';
    if (code <= 3) return 'weather-partly-cloudy';
    if (code <= 48) return 'weather-fog';
    if (code <= 67) return 'weather-rainy';
    if (code <= 77) return 'weather-snowy';
    if (code <= 99) return 'weather-lightning';
    return 'weather-cloudy';
  };

  const getWeatherLabel = (code: number) => {
    if (code <= 1) return t.clearSky;
    if (code <= 3) return t.partlyCloudy;
    if (code <= 48) return t.foggy;
    if (code <= 67) return t.rainy;
    if (code <= 77) return t.snowy;
    if (code <= 99) return t.thunderstorm;
    return t.cloudy;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>{greeting}, {userName}! 🙏</Text>
            <Text style={styles.subText}>{t.farmStatus}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
             <Icon name="account-circle" size={40} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Weather Snapshot */}
        <View style={styles.weatherCard}>
          <View style={styles.weatherHeader}>
            <View style={{flexDirection:'row', alignItems:'center', gap:10}}>
              <Text style={styles.weatherTitle}>{t.weatherToday}</Text>
            </View>
            <View style={{flexDirection:'row', alignItems:'center', gap:4}}>
              <Icon name="map-marker" size={16} color={COLORS.textSecondary} />
              <Text style={styles.weatherLocation}>{location}</Text>
            </View>
          </View>
          <View style={styles.weatherContent}>
            <View style={styles.weatherMain}>
              <Icon name={getWeatherIcon(weatherData.weathercode)} size={48} color={COLORS.primary} />
              <View style={{marginLeft: 15}}>
                <Text style={styles.tempText}>{Math.round(weatherData.temperature)}°C</Text>
                <Text style={styles.weatherDesc}>{getWeatherLabel(weatherData.weathercode)}</Text>
              </View>
            </View>
            <View style={styles.weatherStats}>
              <View style={styles.statRow}>
                <Icon name="weather-windy" size={16} color={COLORS.textSecondary} />
                <Text style={styles.statText}>{Math.round(weatherData.windspeed)} km/h</Text>
              </View>
              <View style={[styles.statRow, {marginTop: 5}]}>
                <Icon name="clock-outline" size={16} color={COLORS.textSecondary} />
                <Text style={styles.statText}>{t.updated}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions Grid */}
        <View style={{flexDirection:'row', alignItems:'center', gap:8, marginBottom:16}}>
           <Icon name="lightning-bolt" size={24} color={COLORS.secondary} />
           <Text style={styles.sectionTitle}>{t.quickActions}</Text>
        </View>
        <View style={styles.gridContainer}>
          <ActionButton 
            image={require('../assets/icons/HomeIcons/crops-analytics.png')} 
            label={t.cropHealth} 
            onPress={() => navigation.navigate('CropRecommendation')} 
          />
          <ActionButton 
            image={require('../assets/icons/HomeIcons/Disease.png')} 
            label={t.scanDisease} 
            onPress={() => navigation.navigate('Disease')} 
            color={COLORS.error}
          />
          <ActionButton 
            image={require('../assets/icons/HomeIcons/weather.png')} 
            label={t.weather} 
            onPress={() => navigation.navigate('Weather')} 
            color={COLORS.secondary}
          />
        </View>

        {/* Tip Card */}
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Icon name="lightbulb-on" size={24} color={COLORS.primaryDark} />
            <Text style={styles.tipTitle}>Farming Tip</Text>
          </View>
          <Text style={styles.tipText}>
            Ideally, irrigate your wheat crop in the early morning to reduce evaporation loss.
          </Text>
        </View>

        {/* Extra Space for Bottom Tab Bar */}
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
  scrollContent: {
    padding: SIZES.padding,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textMain,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  locationText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  subText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  profileButton: {
    padding: 4,
    borderRadius: 20,
    ...SHADOWS.neumorphic,
  },
  
  // Weather Card
  weatherCard: {
    borderRadius: SIZES.radiusLg,
    padding: 24,
    marginBottom: 24,
    ...SHADOWS.neumorphic,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  weatherIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherIconImage: {
    width: 24,
    height: 24,
  },
  weatherTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textMain,
  },
  weatherLocation: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  weatherContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tempText: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.textMain,
  },
  weatherDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  weatherStats: {
    alignItems: 'flex-end',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },

  // Grid
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textMain,
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    width: '30.5%', // 3 columns with proper spacing
    aspectRatio: 1,
    borderRadius: SIZES.radiusMd,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.neumorphic,
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMain,
  },

  // Tip Card
  tipCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: SIZES.radiusMd,
    padding: 20,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.primary,
    ...SHADOWS.neumorphicLight,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  tipText: {
    fontSize: 14,
    color: COLORS.primaryDark,
    lineHeight: 20,
  },
});
