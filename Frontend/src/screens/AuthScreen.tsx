import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { loginUser, registerUser } from "../services/authService";

type Props = {
  onLoginSuccess: () => void;
};

export default function AuthScreen({ onLoginSuccess }: Props) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = async () => {
    if (!email || !password || (!isLogin && !name)) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      if (isLogin) {
        const res = await loginUser(email, password);

        await AsyncStorage.setItem("token", res.token);

        Alert.alert("Success", `Welcome ${res.user?.name || "User"}`);
        onLoginSuccess();
      } else {
        await registerUser(name, email, password);
        Alert.alert("Success", "Account created successfully");
        setIsLogin(true);
      }
    } catch (err: any) {
      Alert.alert("Error", err.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#A8E063", "#1FA463"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.logo}>Krishimitra</Text>

          <Text style={styles.heading}>
            {isLogin ? "Welcome Back" : "Create Account"}
          </Text>

          {!isLogin && (
            <TextInput
              placeholder="Full Name"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          )}

          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleAuth}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>
                {isLogin ? "Login" : "Sign Up"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.switchText}>
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Login"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 28,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
  },
  logo: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1FA463",
    textAlign: "center",
    marginBottom: 8,
  },
  heading: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 25,
    color: "#0B3D2E",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 14,
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#1FA463",
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  switchText: {
    color: "#0B3D2E",
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
  },
});
