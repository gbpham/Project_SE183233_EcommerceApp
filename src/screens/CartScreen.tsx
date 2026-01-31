import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  StatusBar as RNStatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { COLORS, SPACING } from "../lib/theme";
import { Icon } from "../components/ui/Icon";
import { useCart, CartItem } from "../context/CartContext";

type RootStackParamList = {
  Home: undefined;
  Cart: undefined;
  Checkout: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Cart">;

const CartItemCard = ({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}) => (
  <View style={styles.cartItem}>
    <Image source={{ uri: item.product.image }} style={styles.itemImage} />
    <View style={styles.itemInfo}>
      <Text style={styles.itemName} numberOfLines={2}>
        {item.product.title}
      </Text>
      <Text style={styles.itemPrice}>${item.product.price.toFixed(2)}</Text>
      <View style={styles.quantityRow}>
        <View style={styles.quantityControls}>
          <TouchableOpacity
            onPress={() => onUpdateQuantity(item.quantity - 1)}
            style={styles.quantityButton}
          >
            <Icon name="Minus" size={16} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.quantityValue}>{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => onUpdateQuantity(item.quantity + 1)}
            style={styles.quantityButton}
          >
            <Icon name="Plus" size={16} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        <Text style={styles.itemSubtotal}>
          ${(item.product.price * item.quantity).toFixed(2)}
        </Text>
      </View>
    </View>
    <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
      <Icon name="Trash2" size={20} color={COLORS.danger} />
    </TouchableOpacity>
  </View>
);

export default function CartScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { items, updateQuantity, removeFromCart, getTotal } = useCart();

  const handleCheckout = () => {
    navigation.navigate("Checkout");
  };

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Icon name="ShoppingCart" size={80} color={COLORS.border} />
      <Text style={styles.emptyTitle}>Your cart is empty</Text>
      <Text style={styles.emptySubtitle}>
        Add items to your cart to see them here
      </Text>
      <TouchableOpacity
        style={styles.shopButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.shopButtonText}>Start Shopping</Text>
      </TouchableOpacity>
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
        <Text style={styles.headerTitle}>My Cart</Text>
        <View style={styles.cartBadge}>
          <Text style={styles.cartBadgeText}>{items.length}</Text>
        </View>
      </View>

      {items.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.product.id.toString()}
            renderItem={({ item }) => (
              <CartItemCard
                item={item}
                onUpdateQuantity={(q) => updateQuantity(item.product.id, q)}
                onRemove={() => removeFromCart(item.product.id)}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          {/* Order Summary */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${getTotal().toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>Free</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${getTotal().toFixed(2)}</Text>
            </View>
          </View>

          {/* Checkout Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
              <Icon name="ArrowRight" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </>
      )}
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
  cartBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  cartBadgeText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
  listContent: {
    paddingHorizontal: SPACING.l,
    paddingBottom: SPACING.m,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: COLORS.inputBackground,
  },
  itemInfo: {
    flex: 1,
    marginLeft: SPACING.m,
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.inputBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginHorizontal: SPACING.s,
    minWidth: 24,
    textAlign: "center",
  },
  itemSubtotal: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
  },
  removeButton: {
    padding: SPACING.xs,
    alignSelf: "flex-start",
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.l,
    borderRadius: 20,
    padding: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.s,
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
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.s,
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
  footer: {
    padding: SPACING.l,
    paddingBottom: Platform.OS === "ios" ? 32 : SPACING.l,
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 28,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  checkoutButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
    marginRight: SPACING.s,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.xl,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: SPACING.l,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SPACING.s,
  },
  shopButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.xl,
    borderRadius: 28,
    marginTop: SPACING.xl,
  },
  shopButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
