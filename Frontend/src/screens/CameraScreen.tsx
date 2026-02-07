import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';

export default function CameraScreen() {
  const navigation = useNavigation();
  const camera = useRef<Camera>(null);
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();

  /* ---------- PERMISSION ---------- */
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  if (!device) return <View />;
  if (!hasPermission) return <Text>No camera permission</Text>;

  /* ---------- CAPTURE ---------- */
  const takePhoto = async () => {
    if (camera.current) {
      const photo = await camera.current.takePhoto();
      console.log('Photo path:', photo.path);

      // 🔜 TODO: send photo to disease detection backend
    }
  };

  return (
    <View style={styles.container}>
      {/* CAMERA PREVIEW */}
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />

      {/* OVERLAY + SCAN BOX */}
      <View style={styles.overlay}>
        <View style={styles.scanBox} />
      </View>

      {/* BACK BUTTON */}
      <TouchableOpacity
        style={styles.back}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>⬅ Back</Text>
      </TouchableOpacity>

      {/* CAPTURE BUTTON */}
      <TouchableOpacity style={styles.capture} onPress={takePhoto}>
        <Text style={styles.captureText}>📸</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  scanBox: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#2E7D32',
    borderRadius: 8,
  },

  capture: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
  },

  captureText: {
    fontSize: 30,
    color: '#fff',
  },

  back: {
    position: 'absolute',
    top: 40,
    left: 20,
  },

  backText: {
    color: '#fff',
    fontSize: 18,
  },
});
