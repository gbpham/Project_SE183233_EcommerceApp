import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  StatusBar as RNStatusBar,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { COLORS, SPACING } from "../lib/theme";
import { Icon } from "../components/ui/Icon";
import { useAuth } from "../context/AuthContext";

type RootStackParamList = {
  Login: undefined;
  Profile: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Profile">;

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => logout() },
    ]);
  };

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <View style={styles.guestContainer}>
          <View style={styles.guestIconContainer}>
            <Icon name="User" size={60} color={COLORS.border} />
          </View>
          <Text style={styles.guestTitle}>Welcome to ShopApp</Text>
          <Text style={styles.guestSubtitle}>
            Sign in to access your profile and order history
          </Text>
          <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const menuItems = [
    { icon: "Package", label: "My Orders", onPress: () => {} },
    { icon: "Heart", label: "Wishlist", onPress: () => {} },
    { icon: "MapPin", label: "Shipping Address", onPress: () => {} },
    { icon: "CreditCard", label: "Payment Methods", onPress: () => {} },
    { icon: "Settings", label: "Settings", onPress: () => {} },
    { icon: "HelpCircle", label: "Help & Support", onPress: () => {} },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user?.name?.firstname?.[0]?.toUpperCase() || "U"}
              {user?.name?.lastname?.[0]?.toUpperCase() || ""}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user?.name?.firstname} {user?.name?.lastname}
            </Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Icon name="Edit2" size={18} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuItem,
                index < menuItems.length - 1 && styles.menuItemBorder,
              ]}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconContainer}>
                  <Icon
                    name={item.icon as any}
                    size={20}
                    color={COLORS.primary}
                  />
                </View>
                <Text style={styles.menuItemLabel}>{item.label}</Text>
              </View>
              <Icon
                name="ChevronRight"
                size={20}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="LogOut" size={20} color={COLORS.danger} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
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
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.m,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
  },
  guestContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.xl,
  },
  guestIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.inputBackground,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.l,
  },
  guestTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.s,
  },
  guestSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.xl,
  },
  signInButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.xxl,
    borderRadius: 28,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  signInButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.l,
    marginBottom: SPACING.l,
    padding: SPACING.m,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.white,
  },
  userInfo: {
    flex: 1,
    marginLeft: SPACING.m,
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  menuCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.l,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.m,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.m,
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: SPACING.l,
    marginTop: SPACING.l,
    paddingVertical: SPACING.m,
    backgroundColor: "#FEE2E2",
    borderRadius: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.danger,
    marginLeft: SPACING.s,
  },
});
