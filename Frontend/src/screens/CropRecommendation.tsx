import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SHADOWS, FONTS, SIZES } from '../theme/Theme';

const CropCard = ({ name, yield_val, season }: { name: string, yield_val: string, season: string }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Icon name="sprout" size={24} color={COLORS.primary} />
      <Text style={styles.cardTitle}>{name}</Text>
    </View>
    <View style={styles.cardContent}>
      <View style={styles.infoRow}>
        <Icon name="calendar-month" size={16} color={COLORS.textSecondary} />
        <Text style={styles.infoText}>Season: {season}</Text>
      </View>
      <View style={styles.infoRow}>
        <Icon name="scale-balance" size={16} color={COLORS.textSecondary} />
        <Text style={styles.infoText}>Yield: {yield_val}</Text>
      </View>
    </View>
    <TouchableOpacity style={styles.detailsButton}>
      <Text style={styles.detailsButtonText}>View Details</Text>
      <Icon name="chevron-right" size={20} color={COLORS.primary} />
    </TouchableOpacity>
  </View>
);

export default function CropRecommendation() {
  const [activeTab, setActiveTab] = useState<'All' | 'Winter' | 'Summer'>('All');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Crop Advisor</Text>
        <Text style={styles.headerSubtitle}>Smart recommendations for your farm</Text>
      </View>

      <View style={styles.tabsContainer}>
        {['All', 'Winter', 'Summer'].map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab as any)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <CropCard name="Wheat (Lokwan)" yield_val="45-50 Quintal/Acre" season="Rabi (Winter)" />
        <CropCard name="Chickpea (Desi)" yield_val="20-25 Quintal/Acre" season="Rabi (Winter)" />
        <CropCard name="Mustard" yield_val="15-20 Quintal/Acre" season="Rabi (Winter)" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 50, // Safe area
  },
  header: {
    paddingHorizontal: SIZES.padding,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 5,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    marginBottom: 20,
    gap: 10,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: 'transparent',
    ...SHADOWS.neumorphicLight,
  },
  activeTab: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  activeTabText: {
    color: COLORS.primaryDark,
  },
  scrollContent: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 100, // Space for nav bar
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMd,
    padding: 20,
    marginBottom: 20,
    ...SHADOWS.neumorphic,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textMain,
  },
  cardContent: {
    marginBottom: 15,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  detailsButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
