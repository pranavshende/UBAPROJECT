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
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { COLORS, SHADOWS, SIZES } from "../theme/Theme";
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
  const [greeting, setGreeting] = useState("Namaste");
  const [userName, setUserName] = useState("Farmer");

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting("Good Morning");
    else if (hours < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

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
    fetchUser();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>{greeting}, {userName}! 🙏</Text>
            <Text style={styles.subText}>Let's check your farm status today.</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
             <Icon name="account-circle" size={40} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Weather Snapshot */}
        <View style={styles.weatherCard}>
          <View style={styles.weatherHeader}>
            <View style={{flexDirection:'row', alignItems:'center', gap:8}}>
              <Icon name="weather-cloudy-clock" size={24} color={COLORS.primary} />
              <Text style={styles.weatherTitle}>Weather Today</Text>
            </View>
            <View style={{flexDirection:'row', alignItems:'center', gap:4}}>
              <Icon name="map-marker" size={16} color={COLORS.textSecondary} />
              <Text style={styles.weatherLocation}>Pune, MH</Text>
            </View>
          </View>
          <View style={styles.weatherContent}>
            <View style={styles.weatherMain}>
              <Icon name="weather-rainy" size={48} color={COLORS.primary} />
              <View style={{marginLeft: 15}}>
                <Text style={styles.tempText}>28°C</Text>
                <Text style={styles.weatherDesc}>Light Rain Expected</Text>
              </View>
            </View>
            <View style={styles.weatherStats}>
              <View style={styles.statRow}>
                <Icon name="water-percent" size={16} color={COLORS.textSecondary} />
                <Text style={styles.statText}>65% Humidity</Text>
              </View>
              <View style={[styles.statRow, {marginTop: 5}]}>
                <Icon name="white-balance-sunny" size={16} color={COLORS.textSecondary} />
                <Text style={styles.statText}>UV High</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions Grid */}
        <View style={{flexDirection:'row', alignItems:'center', gap:8, marginBottom:16}}>
           <Icon name="lightning-bolt" size={24} color={COLORS.secondary} />
           <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        <View style={styles.gridContainer}>
          <ActionButton 
            image={require('../assets/icons/HomeIcons/crops-analytics.png')} 
            label="Crop Health" 
            onPress={() => navigation.navigate('CropRecommendation')} 
          />
          <ActionButton 
            image={require('../assets/icons/HomeIcons/Disease.png')} 
            label="Scan Disease" 
            onPress={() => navigation.navigate('Disease')} 
            color={COLORS.error}
          />
          <ActionButton 
            image={require('../assets/icons/HomeIcons/weather.png')} 
            label="Weather" 
            onPress={() => navigation.navigate('Weather')} 
            color={COLORS.secondary}
          />
          <ActionButton 
            icon="chart-line" 
            label="Mandi Prices" 
            onPress={() => {}} // TODO: Implement Market
            color={COLORS.accent}
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
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 24,
  },
  actionButton: {
    width: '47%', // roughly half - gap
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
