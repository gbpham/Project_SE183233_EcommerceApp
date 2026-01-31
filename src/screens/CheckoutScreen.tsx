import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
} from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { COLORS, SPACING } from "../lib/theme";
import { Icon } from "../components/ui/Icon";
import { useCart } from "../context/CartContext";

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CheckoutScreen() {
  const navigation = useNavigation();
  const { items, getTotal, clearCart } = useCart();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    card: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!form.address.trim()) {
      newErrors.address = "Delivery address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = () => {
    if (!validateForm()) {
      return;
    }

    if (items.length === 0) {
      Alert.alert("Empty Cart", "Please add items to your cart first.");
      return;
    }

    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    clearCart();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "MainTabs" }],
      }),
    );
  };

  const renderInput = (
    label: string,
    value: string,
    key: keyof typeof form,
    placeholder: string,
    icon: string,
    keyboardType: "default" | "email-address" = "default",
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputContainer,
          errors[key] && styles.inputContainerError,
        ]}
      >
        <Icon
          name={icon as any}
          size={20}
          color={errors[key] ? COLORS.danger : COLORS.textSecondary}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={(text) => {
            setForm((prev) => ({ ...prev, [key]: text }));
            if (errors[key]) {
              setErrors((prev) => ({ ...prev, [key]: "" }));
            }
          }}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          keyboardType={keyboardType}
          autoCapitalize={key === "email" ? "none" : "words"}
        />
      </View>
      {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
    </View>
  );

  const renderCartItem = (item: (typeof items)[0]) => (
    <View key={item.product.id} style={styles.orderItem}>
      <Image
        source={{ uri: item.product.image }}
        style={styles.orderItemImage}
      />
      <View style={styles.orderItemInfo}>
        <Text style={styles.orderItemName} numberOfLines={1}>
          {item.product.title}
        </Text>
        <Text style={styles.orderItemMeta}>
          ${item.product.price.toFixed(2)} × {item.quantity}
        </Text>
      </View>
      <Text style={styles.orderItemTotal}>
        ${(item.product.price * item.quantity).toFixed(2)}
      </Text>
    </View>
  );

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
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 44 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Order Summary */}
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.orderCard}>
            {items.length === 0 ? (
              <Text style={styles.emptyText}>Your cart is empty</Text>
            ) : (
              <>
                {items.map(renderCartItem)}
                <View style={styles.divider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text style={styles.summaryValue}>
                    ${getTotal().toFixed(2)}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Shipping</Text>
                  <Text style={styles.summaryValue}>Free</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>
                    ${getTotal().toFixed(2)}
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* Shipping Details */}
          <Text style={styles.sectionTitle}>Shipping Details</Text>
          <View style={styles.form}>
            {renderInput("Full Name", form.name, "name", "John Doe", "User")}
            {renderInput(
              "Email Address",
              form.email,
              "email",
              "john@example.com",
              "Mail",
              "email-address",
            )}
            {renderInput(
              "Delivery Address",
              form.address,
              "address",
              "123 Main St, New York",
              "MapPin",
            )}
            {renderInput(
              "Credit Card (Optional)",
              form.card,
              "card",
              "**** **** **** 1234",
              "CreditCard",
            )}
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Sticky Checkout Button */}
        <View style={styles.footer}>
          <View style={styles.footerTotal}>
            <Text style={styles.footerTotalLabel}>Total</Text>
            <Text style={styles.footerTotalValue}>
              ${getTotal().toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.checkoutButton,
              items.length === 0 && styles.checkoutButtonDisabled,
            ]}
            onPress={handleCheckout}
            disabled={items.length === 0}
          >
            <Text style={styles.checkoutButtonText}>Place Order</Text>
            <Icon name="ArrowRight" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={handleSuccessClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIcon}>
              <Icon name="CheckCircle" size={60} color={COLORS.success} />
            </View>
            <Text style={styles.successTitle}>Order Placed!</Text>
            <Text style={styles.successSubtitle}>
              Thank you for your order. You will receive a confirmation email
              shortly.
            </Text>

            <View style={styles.orderDetails}>
              <Text style={styles.orderDetailsTitle}>Order Details</Text>
              <View style={styles.orderDetailRow}>
                <Text style={styles.orderDetailLabel}>Name</Text>
                <Text style={styles.orderDetailValue}>{form.name}</Text>
              </View>
              <View style={styles.orderDetailRow}>
                <Text style={styles.orderDetailLabel}>Email</Text>
                <Text style={styles.orderDetailValue}>{form.email}</Text>
              </View>
              <View style={styles.orderDetailRow}>
                <Text style={styles.orderDetailLabel}>Address</Text>
                <Text style={styles.orderDetailValue}>{form.address}</Text>
              </View>
              <View style={styles.orderDetailRow}>
                <Text style={styles.orderDetailLabel}>Items</Text>
                <Text style={styles.orderDetailValue}>{items.length}</Text>
              </View>
              <View style={styles.orderDetailRow}>
                <Text style={styles.orderDetailLabel}>Total</Text>
                <Text
                  style={[styles.orderDetailValue, { color: COLORS.primary }]}
                >
                  ${getTotal().toFixed(2)}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleSuccessClose}
            >
              <Text style={styles.modalButtonText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === "android" ? 30 : 0,
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
  scrollContent: {
    padding: SPACING.l,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.m,
    marginTop: SPACING.s,
  },
  orderCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: SPACING.m,
    marginBottom: SPACING.l,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.s,
  },
  orderItemImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: COLORS.inputBackground,
  },
  orderItemInfo: {
    flex: 1,
    marginLeft: SPACING.m,
  },
  orderItemName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  orderItemMeta: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  orderItemTotal: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.s,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.xs,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.primary,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    paddingVertical: SPACING.m,
  },
  form: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputGroup: {
    marginBottom: SPACING.m,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
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
    height: 52,
  },
  inputContainerError: {
    borderColor: COLORS.danger,
  },
  inputIcon: {
    marginRight: SPACING.s,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.danger,
    marginTop: 4,
    marginLeft: 4,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.m,
    paddingBottom: Platform.OS === "ios" ? 32 : SPACING.m,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerTotal: {
    flex: 1,
  },
  footerTotalLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  footerTotalValue: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.xl,
    borderRadius: 28,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  checkoutButtonDisabled: {
    opacity: 0.5,
  },
  checkoutButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
    marginRight: SPACING.s,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.l,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: SPACING.xl,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  successIcon: {
    marginBottom: SPACING.m,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: SPACING.s,
  },
  successSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.l,
  },
  orderDetails: {
    width: "100%",
    backgroundColor: COLORS.inputBackground,
    borderRadius: 16,
    padding: SPACING.m,
    marginBottom: SPACING.l,
  },
  orderDetailsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.s,
  },
  orderDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.xs,
  },
  orderDetailLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  orderDetailValue: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
    flex: 1,
    textAlign: "right",
    marginLeft: SPACING.m,
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.xl,
    borderRadius: 28,
    width: "100%",
  },
  modalButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
});
