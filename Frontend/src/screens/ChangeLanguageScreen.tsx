import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthStackParamList } from '../navigation/types';
import { useLanguage } from '../i18n/LanguageContexts';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'ChangeLanguage'>;

const { width } = Dimensions.get('window');

const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
//   { code: 'kn', name: 'Kannada', nativeName: 'कन्नड़' },
];

const COLORS = {
  primary: '#4ADE80',
  white: '#FFFFFF',
  black: '#000000',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  background: '#FFFFFF',
};

export default function ChangeLanguageScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { language, changeLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  const handleSave = async () => {
    await changeLanguage(selectedLanguage);
    navigation.navigate('Login');
  };

  const handleSkip = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 40 }} /> 
        <Text style={styles.headerTitle}></Text>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Placeholder for the Logo/Illustration */}
        <View style={styles.illustrationContainer}>
           {/* If you have a specific logo image, import it and use <Image source={require('../assets/logo.png')} ... /> */}
           {/* For now, using a large icon as placeholder, as per request 'logo has not appeared' */}
          <Icon name="translate" size={120} color={COLORS.textSecondary} />
        </View>

        <Text style={styles.title}>Choose Your Preferred Language</Text>
        <Text style={styles.subtitle}>Please Select Your Language</Text>

        {/* Language List */}
        <View style={styles.listContainer}>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageItem,
                selectedLanguage === lang.code && styles.selectedItem
              ]}
              onPress={() => setSelectedLanguage(lang.code as any)}
            >
              <View style={styles.radioContainer}>
                <View style={[
                  styles.radioOuter,
                  selectedLanguage === lang.code && { borderColor: COLORS.primary }
                ]}>
                  {selectedLanguage === lang.code && <View style={styles.radioInner} />}
                </View>
              </View>
              <Text style={styles.languageText}>{lang.nativeName}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Save Button - Moved up, inside ScrollView or just below list */}
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save & Continue</Text>
            <Icon name="arrow-right" size={20} color={COLORS.white} />
            </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.black,
    letterSpacing: 1,
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
    // Add opacity or styling if needed
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  listContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    // borderTopWidth: 1,
    // borderTopColor: COLORS.border,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  selectedItem: {
    backgroundColor: '#F0FDF4', // Light green background for selected
  },
  radioContainer: {
    marginRight: 16,
    marginLeft: 8,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.primary,
  },
  languageText: {
    fontSize: 18,
    color: COLORS.black,
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: 40,
    width: '100%',
    alignItems: 'center',
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
    marginRight: 8,
  },
});
