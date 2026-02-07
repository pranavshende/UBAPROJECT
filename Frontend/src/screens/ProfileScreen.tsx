import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Image,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import { useNavigation } from '@react-navigation/native';

const API_URL = 'http://10.0.2.2:5000/api/auth/profile';
const PHOTO_URL = 'http://10.0.2.2:5000/api/auth/profile/photo';
const IMAGE_BASE = 'http://10.0.2.2:5000/';
/* 🔗 API CONFIG */


export default function ProfileScreen() {
  const navigation = useNavigation();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    phone: '',
    village: '',
    landSize: '',
  });

  /* ---------------- FETCH PROFILE ---------------- */
  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return handleLogout();

      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to fetch profile');

      setUser(data);
      setForm({
        phone: data.phone || '',
        village: data.village || '',
        landSize: data.landSize || '',
      });
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /* ---------------- SAVE PROFILE ---------------- */
  const saveProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const res = await fetch(API_URL, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Update failed');

      setUser(data);
      setEditing(false);
      Alert.alert('Success', 'Profile updated');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  /* ---------------- IMAGE PICK ---------------- */
  const chooseImage = () => {
    Alert.alert('Profile Photo', 'Choose an option', [
      { text: 'Camera', onPress: openCamera },
      { text: 'Gallery', onPress: openGallery },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const openCamera = async () => {
    try {
      const image = await ImagePicker.openCamera({
        cropping: true,
        cropperCircleOverlay: true,
      });
      handleImage(image);
    } catch {}
  };

  const openGallery = async () => {
    try {
      const image = await ImagePicker.openPicker({
        cropping: true,
        cropperCircleOverlay: true,
      });
      handleImage(image);
    } catch {}
  };

  /* ---------------- IMAGE UPLOAD ---------------- */
  const handleImage = async (image: any) => {
    try {
      const resized = await ImageResizer.createResizedImage(
        image.path,
        800,
        800,
        'JPEG',
        70
      );

      const token = await AsyncStorage.getItem('token');
      const formData = new FormData();

      formData.append('photo', {
        uri: resized.uri,
        type: 'image/jpeg',
        name: `profile-${Date.now()}.jpg`,
      } as any);

      const res = await fetch(PHOTO_URL, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Upload failed');

      setUser(data);
      Alert.alert('Success', 'Profile photo updated');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth' as never }],
    });
  };

  /* ---------------- UI STATES ---------------- */
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loader}>
        <Text>Unable to load profile</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => setEditing(!editing)}>
          <Text style={styles.edit}>{editing ? 'Cancel' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      {/* PROFILE PHOTO */}
      <View style={styles.profileCard}>
        <TouchableOpacity onPress={chooseImage}>
          {user.profileImage ? (
            <Image
              source={{ uri: IMAGE_BASE + user.profileImage }}
              style={styles.avatarImage}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatar}>👤</Text>
              <Text style={styles.changeText}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* DETAILS */}
      <View style={styles.infoCard}>
        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>{user.role || 'Farmer'}</Text>

        <Text style={styles.label}>Phone</Text>
        {editing ? (
          <TextInput
            style={styles.input}
            value={form.phone}
            onChangeText={(t) => setForm({ ...form, phone: t })}
          />
        ) : (
          <Text style={styles.value}>{user.phone || 'Not added'}</Text>
        )}

        <Text style={styles.label}>Village</Text>
        {editing ? (
          <TextInput
            style={styles.input}
            value={form.village}
            onChangeText={(t) => setForm({ ...form, village: t })}
          />
        ) : (
          <Text style={styles.value}>{user.village || 'Not added'}</Text>
        )}

        <Text style={styles.label}>Land Size</Text>
        {editing ? (
          <TextInput
            style={styles.input}
            value={form.landSize}
            onChangeText={(t) => setForm({ ...form, landSize: t })}
          />
        ) : (
          <Text style={styles.value}>{user.landSize || 'Not added'}</Text>
        )}
      </View>

      {editing && (
        <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    paddingTop: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical:20,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  back: {
    fontSize: 22,
    color: '#1B5E20',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  edit: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 6,
  },
  avatar: {
    fontSize: 60,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  email: {
    fontSize: 14,
    color: '#558B2F',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 4,
  },
  label: {
    fontSize: 13,
    color: '#558B2F',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
  },
  input: {
    borderWidth: 1,
    borderColor: '#A5D6A7',
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
    color: '#1B5E20',
  },
  saveBtn: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: '#2E7D32',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  logoutBtn: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: '#C62828',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
avatarImage: {
  width: 90,
  height: 90,
  borderRadius: 45,
  marginBottom: 10,
},
avatarPlaceholder: {
  alignItems: 'center',
  marginBottom: 10,
},
changeText: {
  fontSize: 12,
  color: '#2E7D32',
  marginTop: 4,
},
});
