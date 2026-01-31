import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  StatusBar as RNStatusBar,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { COLORS, SPACING } from "../lib/theme";
import { Icon } from "../components/ui/Icon";
import { useCart } from "../context/CartContext";
import { ApiProduct } from "../lib/api";

export default function ProductDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { product } = route.params as { product: ApiProduct };
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [imageLoading, setImageLoading] = useState(true);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    navigation.goBack();
  };

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

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
        <Text style={styles.headerTitle}>Detail Product</Text>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="Heart" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Product Image */}
        <View style={styles.imageContainer}>
          {imageLoading && (
            <ActivityIndicator
              size="large"
              color={COLORS.primary}
              style={styles.imageLoader}
            />
          )}
          <Image
            source={{ uri: product.image }}
            style={styles.productImage}
            resizeMode="contain"
            onLoadEnd={() => setImageLoading(false)}
          />
        </View>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          <View style={styles.brandRow}>
            <Text style={styles.brand}>{product.category.toUpperCase()}</Text>
            <View style={styles.ratingContainer}>
              <Icon name="Star" size={16} color="#F59E0B" />
              <Text style={styles.rating}>{product.rating.rate}</Text>
              <Text style={styles.ratingCount}>({product.rating.count})</Text>
            </View>
          </View>

          <Text style={styles.productTitle}>{product.title}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          </View>

          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Quantity Selector */}
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Quantity</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                onPress={decrementQuantity}
                style={styles.quantityButton}
              >
                <Icon name="Minus" size={18} color={COLORS.text} />
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <TouchableOpacity
                onPress={incrementQuantity}
                style={styles.quantityButton}
              >
                <Icon name="Plus" size={18} color={COLORS.text} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Price</Text>
          <Text style={styles.totalPrice}>
            ${(product.price * quantity).toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <Icon name="ShoppingCart" size={20} color={COLORS.white} />
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
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
  scrollContent: {
    paddingBottom: 120,
  },
  imageContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.l,
    borderRadius: 24,
    padding: SPACING.xl,
    alignItems: "center",
    justifyContent: "center",
    height: 300,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  imageLoader: {
    position: "absolute",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    padding: SPACING.l,
  },
  brandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.s,
  },
  brand: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary,
    letterSpacing: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: SPACING.s,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rating: {
    fontSize: 14,
    fontWeight: "700",
    color: "#D97706",
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 12,
    color: "#D97706",
    marginLeft: 2,
  },
  productTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.m,
    lineHeight: 30,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.l,
  },
  price: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.primary,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.s,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.l,
  },
  quantitySection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: SPACING.m,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.inputBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginHorizontal: SPACING.m,
    minWidth: 30,
    textAlign: "center",
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
  totalContainer: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.text,
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.xl,
    borderRadius: 28,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
    marginLeft: SPACING.s,
  },
});
