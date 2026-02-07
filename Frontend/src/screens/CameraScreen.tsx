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
} from 'react-native';

import ImagePicker from 'react-native-image-crop-picker';
import axios, { AxiosError } from 'axios';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

const API_BASE = 'http://192.168.1.2:8000'; // 🔁 CHANGE IF NEEDED
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
        Alert.alert(
          'Network Error',
          'Make sure backend is running and phone & PC are on same WiFi'
        );
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
      `${API_BASE}/export/pdf`, // 🔥 DIRECT PATH FROM app.py
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🌱 Plant Disease Detection</Text>

      {image && <Image source={{ uri: image.path }} style={styles.image} />}

      <View style={styles.row}>
        <TouchableOpacity style={styles.btn} onPress={openCamera}>
          <Text style={styles.btnText}>📸 Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={openGallery}>
          <Text style={styles.btnText}>🖼️ Gallery</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.detectBtn}
        onPress={detectDisease}
        disabled={loading}
      >
        <Text style={styles.detectText}>
          {loading ? 'Detecting...' : 'Detect Disease'}
        </Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#2e7d32" />}

      {/* ERROR */}
      {errorMsg && (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>⚠️ Error</Text>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}

      {/* RESULT */}
      {result && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>🧠 AI Result</Text>

          <Text style={styles.resultText}>
            Disease: <Text style={styles.bold}>{result.disease}</Text>
          </Text>

          <Text style={styles.resultText}>
            Confidence:{' '}
            <Text style={styles.bold}>{result.confidence}%</Text>
          </Text>

          {result.warning && (
            <Text style={styles.warningText}>⚠️ {result.warning}</Text>
          )}

          <Text style={styles.recTitle}>✅ Recommendations</Text>
          {(result.recommendations ?? []).map(
            (item: string, index: number) => (
              <Text key={index} style={styles.recItem}>
                • {item}
              </Text>
            )
          )}

          {/* PDF + RESET */}
          <View style={{ marginTop: 16 }}>
            <TouchableOpacity
              style={styles.pdfBtn}
              onPress={downloadPdf}
              disabled={pdfLoading}
            >
              <Text style={styles.btnText}>
                {pdfLoading ? 'Generating PDF...' : '📄 Download PDF'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.pdfBtn, { backgroundColor: '#aaa' }]}
              onPress={resetAll}
            >
              <Text style={styles.btnText}>🔁 New Detection</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};
export default DiseaseDetection;

const styles = StyleSheet.create({
  /* ---------- SCREEN ---------- */
  container: {
    padding: 40,
    paddingBottom: 40,
    backgroundColor: '#f4fdf5',
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1b5e20',
  },

  /* ---------- IMAGE ---------- */
  image: {
    width: '100%',
    height: 230,
    borderRadius: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },

  /* ---------- BUTTON ROW ---------- */
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  btn: {
    width: '48%',
    paddingVertical: 14,
    backgroundColor: '#66bb6a',
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },

  btnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },

  /* ---------- DETECT BUTTON ---------- */
  detectBtn: {
    marginTop: 6,
    paddingVertical: 16,
    backgroundColor: '#2e7d32',
    borderRadius: 14,
    alignItems: 'center',
    elevation: 3,
  },

  detectText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.4,
  },

  /* ---------- ERROR ---------- */
  errorCard: {
    marginTop: 18,
    padding: 14,
    backgroundColor: '#fdecea',
    borderRadius: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#d32f2f',
  },

  errorTitle: {
    fontWeight: '800',
    color: '#b71c1c',
    marginBottom: 4,
    fontSize: 15,
  },

  errorText: {
    color: '#b71c1c',
    fontSize: 14,
    lineHeight: 20,
  },

  /* ---------- RESULT CARD ---------- */
  resultCard: {
    marginTop: 24,
    padding: 18,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    elevation: 3,
  },

  resultTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
    color: '#1b5e20',
  },

  resultText: {
    fontSize: 15,
    marginBottom: 6,
    color: '#263238',
  },

  bold: {
    fontWeight: '700',
    color: '#000',
  },

  /* ---------- WARNING ---------- */
  warningText: {
    marginTop: 6,
    padding: 8,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    color: '#856404',
    fontWeight: '600',
    fontSize: 13,
  },

  /* ---------- RECOMMENDATIONS ---------- */
  recTitle: {
    marginTop: 14,
    marginBottom: 6,
    fontWeight: '800',
    color: '#2e7d32',
    fontSize: 15,
  },

  recItem: {
    fontSize: 14,
    color: '#37474f',
    marginLeft: 6,
    marginBottom: 4,
    lineHeight: 20,
  },

  /* ---------- PDF / ACTION BUTTONS ---------- */
  pdfBtn: {
    marginTop: 12,
    paddingVertical: 14,
    backgroundColor: '#1976d2',
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
});

