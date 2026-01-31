import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  StatusBar as RNStatusBar,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { COLORS, SPACING } from "../lib/theme";
import { Icon } from "../components/ui/Icon";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter username and password");
      return;
    }

    setIsLoading(true);
    try {
      // FakeStoreAPI test credentials: username: "mor_2314", password: "83r5^_"
      await login(username, password);
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Login Failed",
        "Invalid username or password. Try: mor_2314 / 83r5^_",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="ArrowLeft" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sign In</Text>
        <View style={{ width: 44 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          {/* Welcome Text */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome Back!</Text>
            <Text style={styles.welcomeSubtitle}>
              Sign in to continue shopping
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <View style={styles.inputContainer}>
                <Icon
                  name="User"
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Enter your username"
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <Icon
                  name="Lock"
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Icon
                    name={showPassword ? "EyeOff" : "Eye"}
                    size={20}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.loginButton,
                isLoading && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Demo Credentials Hint */}
            <View style={styles.hintCard}>
              <Icon name="Info" size={16} color={COLORS.primary} />
              <Text style={styles.hintText}>Demo: mor_2314 / 83r5^_</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.m,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  content: {
    padding: SPACING.l,
  },
  welcomeSection: {
    marginBottom: SPACING.xl,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  form: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: SPACING.l,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputGroup: {
    marginBottom: SPACING.m,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.xs,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBackground,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.m,
    height: 56,
  },
  inputIcon: {
    marginRight: SPACING.s,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: SPACING.l,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "700",
  },
  hintCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    padding: SPACING.m,
    borderRadius: 12,
    marginTop: SPACING.l,
  },
  hintText: {
    fontSize: 13,
    color: COLORS.primary,
    marginLeft: SPACING.s,
    fontWeight: "500",
  },
});
