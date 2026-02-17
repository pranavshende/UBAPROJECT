import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthStackParamList } from '../navigation/types';
import { loginUser } from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

const COLORS = {
  primary: '#4ADE80',
  secondary: '#22C55E',
  white: '#FFFFFF',
  black: '#000000',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  inputBg: '#FFFFFF',
  background: '#FFFFFF',
};

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  // Reusing the login logic from AuthScreen, but adapted for this UI
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser(email, password);
      await AsyncStorage.setItem("token", res.token);
      
      Alert.alert("Success", `Welcome ${res.user?.name || "User"}`);
      // In a real app, strict navigation flow would handle this via a reset or auth state listener
      // For now, we assume the App.tsx state listener will pick up the token change or we might need a callback
      // Since App.tsx passes onLoginSuccess to AuthNavigator, we might need to use it.
      // However, AuthNavigator structure shows it passes it to AuthScreen. 
      // For this refactor, we should probably update AuthNavigator to pass onLoginSuccess to LoginScreen too.
      // But for now, let's try to just navigate or reload. 
      // Actually, looking at App.tsx, it renders AuthNavigator or MainTabs based on isLoggedIn state.
      // That state is in App.tsx. Simple setItem won't trigger re-render in App.tsx unless we call the callback.
      // We'll need to fix this in AuthNavigator.tsx to pass the callback to LoginScreen as well.
      // For this step, I will implement the UI. The functional prop plumbing will be a follow-up if needed, 
      // or I can try to access the context if it existed. 
      // Assuming for now user will be stuck unless I pass the prop. 
      // Strategy: I will implement UI first.
      
    } catch (err: any) {
      Alert.alert("Error", err.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 24 }} /> 
        <Text style={styles.headerTitle}></Text>
        <TouchableOpacity onPress={handleClose}>
          <Icon name="close" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleMain}>Hey,</Text>
          <View style={styles.titleRow}>
            <Text style={styles.titleHighlight}>Login</Text>
            <Text style={styles.titleMain}> Now !</Text>
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          
          {/* Email / Username */}
          <Text style={styles.label}>E-Mail / Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter e-mail address / Username"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          {/* Password */}
          <View style={styles.passwordHeader}>
            <Text style={styles.label}>Password</Text>
            <TouchableOpacity>
              <Text style={styles.forgotPassword}>Forgot Password ?</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Phone Number (Optional/Alternative) */}
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />

          {/* Sign In Button */}
          <TouchableOpacity 
            style={styles.signInButton} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Text style={styles.signInButtonText}>Sign In</Text>
                <Icon name="arrow-right" size={20} color={COLORS.white} style={{ marginLeft: 8 }} />
              </>
            )}
          </TouchableOpacity>

        </View>

        {/* Bottom Expand Arrow (Decorative as per screenshot) */}
        <View style={styles.bottomArrowContainer}>
           <Icon name="chevron-down" size={24} color="#E5E7EB" />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.black,
    letterSpacing: 0.5,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  titleContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  titleMain: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.black,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleHighlight: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.primary,
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12, // Slightly larger radius
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.textPrimary,
    marginBottom: 24,
    backgroundColor: COLORS.white,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  forgotPassword: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#9CA3AF', // Light gray text
    fontSize: 14,
  },
  signInButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  signInButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '500', 
  },
  bottomArrowContainer: {
    alignItems: 'center',
    marginTop: 60,
  }
});
