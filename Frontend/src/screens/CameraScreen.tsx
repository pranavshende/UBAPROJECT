import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
} from 'react-native';

import ImagePicker from 'react-native-image-crop-picker'; 
import axios, { AxiosError } from 'axios';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SHADOWS, SIZES } from '../theme/Theme';

const API_BASE = 'http://10.121.185.59:8000'; // 🔁 CHANGE IF NEEDED
const DETECT_URL = `${API_BASE}/detect`;
const PDF_URL = `${API_BASE}/export/pdf`;

const DiseaseDetection: React.FC = () => {
  // -------------------- STATE --------------------
  const [image, setImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // -------------------- HELPERS --------------------
  const resetAll = useCallback(() => {
    setImage(null);
    setResult(null);
    setErrorMsg(null);
  }, []);

  // -------------------- IMAGE PICK --------------------
  const openCamera = useCallback(async () => {
    try {
      const img = await ImagePicker.openCamera({
        cropping: true,
        compressImageQuality: 0.8,
      });
      setImage(img);
      setResult(null);
      setErrorMsg(null);
    } catch (e) {
      console.log('Camera error:', e);
    }
  }, []);

  const openGallery = useCallback(async () => {
    try {
      const img = await ImagePicker.openPicker({
        cropping: true,
        compressImageQuality: 0.8,
      });
      setImage(img);
      setResult(null);
      setErrorMsg(null);
    } catch (e) {
      console.log('Gallery error:', e);
    }
  }, []);

  // -------------------- DETECT --------------------
  const detectDisease = useCallback(async () => {
    if (!image) {
      Alert.alert('No Image', 'Please select or capture an image');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('image', {
      uri: image.path,
      type: image.mime ?? 'image/jpeg',
      name: 'plant.jpg',
    } as any);

    try {
      // MOCK RESULT for UI Demo purposes if backend is unreachable
      // Remove this block in production
      /*
      setTimeout(() => {
        setResult({
          disease: "Leaf Blight",
          confidence: "88",
          warning: "High Severity",
          recommendations: [
            "Remove infected leaves immediately.",
            "Spray copper-based fungicides.",
            "Ensure proper drainage in the field."
          ]
        });
        setLoading(false);
      }, 2000);
      return; 
      */
     
      const response = await axios.post(DETECT_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 20000,
      });

      setResult(response.data);
    } catch (err) {
      const error = err as AxiosError<any>;

      if (error.response) {
        const msg =
          error.response.data?.error ||
          error.response.data?.message ||
          'Server error';
        setErrorMsg(msg);
        Alert.alert('Server Error', msg);
      } else if (error.request) {
        setErrorMsg('Cannot reach backend server');
        // Fallback for demo
         setResult({
          disease: "Leaf Blight (Demo)",
          confidence: "88",
          warning: "High Severity",
          recommendations: [
            "Remove infected leaves immediately.",
            "Spray copper-based fungicides.",
            "Ensure proper drainage in the field."
          ]
        });
      } else {
        setErrorMsg(error.message);
        Alert.alert('Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [image]);

  // -------------------- PDF DOWNLOAD --------------------
  const downloadPdf = useCallback(async () => {
    if (!image) {
      Alert.alert('No Image', 'Please detect disease first');
      return;
    }

    setPdfLoading(true);

    const formData = new FormData();
    formData.append('file', {
      uri: image.path,
      type: image.mime ?? 'image/jpeg',
      name: 'plant.jpg',
    } as any);

    try {
      const response = await axios.post(
        PDF_URL,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          responseType: 'blob', // ✅ IMPORTANT
          timeout: 20000,
        }
      );

      const pdfPath = `${RNFS.DownloadDirectoryPath}/cotton_disease_report_${Date.now()}.pdf`;

      // Convert blob → base64
      const reader = new FileReader();
      reader.readAsDataURL(response.data);
      reader.onloadend = async () => {
        const base64data = reader.result?.toString().split(',')[1];
        if (!base64data) throw new Error('PDF conversion failed');

        await RNFS.writeFile(pdfPath, base64data, 'base64');
        Alert.alert('PDF Saved', 'Saved to Downloads folder');
        await Share.open({
          url: `file://${pdfPath}`,
          type: 'application/pdf',
        });
      };
    } catch (error) {
      console.log('PDF Error:', error);
      Alert.alert('PDF Error', 'Failed to generate or download PDF');
    } finally {
      setPdfLoading(false);
    }
  }, [image]);


  // -------------------- UI --------------------
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {!image ? (
        <View style={styles.emptyState}>
           <Text style={styles.title}>Crop Doctor 🏥</Text>
           <Text style={styles.subtitle}>Scan leaves to detect diseases instantly.</Text>
           
           <View style={styles.scanButtonContainer}>
              <TouchableOpacity style={styles.scanButton} onPress={openCamera}>
                 <Icon name="camera" size={40} color={COLORS.primary} />
              </TouchableOpacity>
              <View style={styles.pulseRing} />
           </View>
           <Text style={styles.scanText}>Tap to Scan</Text>

           <TouchableOpacity style={styles.galleryButton} onPress={openGallery}>
              <Icon name="image" size={20} color={COLORS.textSecondary} />
              <Text style={styles.galleryText}>Select from Gallery</Text>
           </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.resultContainer}>
          <Image source={{ uri: image.path }} style={styles.imageConfig} />
          
          <TouchableOpacity style={styles.retakeBtn} onPress={resetAll}>
             <Icon name="close-circle" size={24} color={COLORS.white} />
          </TouchableOpacity>

          {loading ? (
             <View style={styles.loadingBox}>
               <ActivityIndicator size="large" color={COLORS.primary} />
               <Text style={styles.analyzingText}>Analyzing Leaf...</Text>
             </View>
          ) : (
             <View style={styles.actionCard}>
                {!result && !errorMsg && (
                   <TouchableOpacity style={styles.detectBtn} onPress={detectDisease}>
                      <Text style={styles.detectBtnText}>🔍 Analyze Disease</Text>
                   </TouchableOpacity>
                )}

                {errorMsg && (
                   <View style={styles.errorBox}>
                      <Icon name="alert-circle" size={20} color={COLORS.error} />
                      <Text style={styles.errorText}>{errorMsg}</Text>
                   </View>
                )}

                {result && (
                  <View>
                     <View style={[styles.severityBadge, 
                        (result.warning && result.warning.includes('High')) ? styles.highSev : styles.medSev
                     ]}>
                        <Icon name="alert" size={16} color={(result.warning && result.warning.includes('High')) ? '#C62828' : '#F57F17'} />
                        <Text style={[styles.severityText, (result.warning && result.warning.includes('High')) ? {color:'#C62828'} : {color:'#F57F17'}]}>
                           {result.warning || 'Moderate Severity'}
                        </Text>
                     </View>

                     <Text style={styles.resultTitle}>{result.disease}</Text>
                     <Text style={styles.confidence}>Confidence: {result.confidence}%</Text>
                     
                     <View style={styles.divider} />
                     
                     <Text style={styles.sectionHeader}>Recommended Treatment</Text>
                     <View style={styles.treatmentBox}>
                        {(result.recommendations ?? []).map((item: string, index: number) => (
                           <View key={index} style={styles.treatmentItem}>
                              <Icon name="check-circle" size={18} color={COLORS.primary} />
                              <Text style={styles.treatmentText}>{item}</Text>
                           </View>
                        ))}
                     </View>

                     <View style={styles.btnRow}>
                        <TouchableOpacity style={styles.speakBtn}>
                           <Icon name="volume-high" size={24} color={COLORS.primary} />
                           <Text style={styles.speakText}>Listen</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                           style={[styles.pdfBtn, pdfLoading && {opacity: 0.7}]} 
                           onPress={downloadPdf}
                           disabled={pdfLoading}
                        >
                           {pdfLoading ? <ActivityIndicator color={COLORS.white} /> : <Icon name="file-pdf-box" size={24} color={COLORS.white} />}
                           <Text style={styles.pdfText}>Report</Text>
                        </TouchableOpacity>
                     </View>
                  </View>
                )}
             </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default DiseaseDetection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  /* EMPTY STATE */
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 50,
  },
  scanButtonContainer: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  scanButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    ...SHADOWS.neumorphic,
  },
  pulseRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: 'rgba(76, 175, 80, 0.2)',
    zIndex: 1,
  },
  scanText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textMain,
    marginBottom: 40,
  },
  galleryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    ...SHADOWS.neumorphicLight,
  },
  galleryText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
  },

  /* RESULT STATE */
  resultContainer: {
    padding: SIZES.padding,
    paddingBottom: 100,
  },
  imageConfig: {
    width: '100%',
    height: 300,
    borderRadius: SIZES.radiusLg,
    marginBottom: -40, // overlap
    zIndex: 1,
  },
  retakeBtn: {
    position: 'absolute',
    top: 30,
    right: 30,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 4,
  },
  actionCard: {
    borderRadius: 30,
    padding: 24,
    paddingTop: 50,
    ...SHADOWS.neumorphic,
    minHeight: 300,
    width: '100%',
  },
  loadingBox: {
    marginTop: 60, 
    alignItems: 'center',
    padding: 30,
    borderRadius: 30,
    ...SHADOWS.neumorphic,
  },
  analyzingText: {
    marginTop: 16,
    color: COLORS.primaryDark,
    fontWeight: '600',
  },
  detectBtn: {
    ...SHADOWS.neumorphic,
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: SIZES.radiusMd,
    alignItems: 'center',
    marginTop: 10,
  },
  detectBtnText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFEBEE',
    padding: 16,
    borderRadius: 16,
    marginTop: 10,
  },
  errorText: {
    color: COLORS.error,
    flex: 1,
  },
  
  /* RESULT DATA */
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginBottom: 12,
    borderWidth: 1,
  },
  highSev: {
    backgroundColor: '#FFEBEE',
    borderColor: '#C62828',
  },
  medSev: {
    backgroundColor: '#FFF3E0',
    borderColor: '#F57F17',
  },
  severityText: {
    fontWeight: '700',
    fontSize: 12,
  },
  resultTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.textMain,
    marginBottom: 4,
  },
  confidence: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textMain,
    marginBottom: 12,
  },
  treatmentBox: {
    backgroundColor: COLORS.primaryLight,
    padding: 16,
    borderRadius: 16,
    gap: 10,
    marginBottom: 24,
  },
  treatmentItem: {
    flexDirection: 'row',
    gap: 10,
  },
  treatmentText: {
    flex: 1,
    lineHeight: 20,
    color: COLORS.textSecondary,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 16,
  },
  speakBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    ...SHADOWS.neumorphicLight,
  },
  speakText: {
    fontWeight: '600',
    color: COLORS.primary,
  },
  pdfBtn: {
    ...SHADOWS.neumorphic,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
  },
  pdfText: {
    fontWeight: '600',
    color: COLORS.white,
  },
});
