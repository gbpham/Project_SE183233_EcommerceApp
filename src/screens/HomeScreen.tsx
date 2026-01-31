import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar as RNStatusBar,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { COLORS, SPACING } from "../lib/theme";
import { Icon } from "../components/ui/Icon";
import { CategoryItem } from "../components/ui/CategoryItem";
import { useCart } from "../context/CartContext";
import { fetchProducts, fetchCategories, ApiProduct } from "../lib/api";
import { RootStackParamList } from "../navigation/AppNavigator";
import { CATEGORIES, getCategoryByName } from "../data/categories";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "MainTabs">;

const ProductCard = ({
  product,
  onPress,
  onAddToCart,
}: {
  product: ApiProduct;
  onPress: () => void;
  onAddToCart: () => void;
}) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: product.image }}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{product.category}</Text>
      </View>
    </View>
    <View style={styles.cardContent}>
      <View style={styles.row}>
        <Text style={styles.productName} numberOfLines={1}>
          {product.title}
        </Text>
      </View>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      <View style={styles.actionRow}>
        <View style={styles.rating}>
          <Icon name="Star" size={14} color="#F59E0B" />
          <Text style={styles.ratingText}>{product.rating.rate}</Text>
          <Text style={styles.ratingCount}>({product.rating.count})</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
        >
          <Icon name="Plus" size={18} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [productsData, categoriesData] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError("Failed to load products. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    if (selectedCategory) {
      return products.filter((p) => p.category === selectedCategory);
    }
    return products;
  }, [products, selectedCategory]);

  const handleProductPress = (product: ApiProduct) => {
    navigation.navigate("ProductDetail", { product });
  };

  const handleAddToCart = (product: ApiProduct) => {
    addToCart(product);
  };

  const renderHeader = () => (
    <View>
      {/* Logo Header */}
      <View style={styles.appHeader}>
        <Icon name="Codesandbox" size={32} color={COLORS.text} />
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="ShoppingBag" size={24} color={COLORS.text} />
          <View style={styles.dot} />
        </TouchableOpacity>
      </View>

      {/* Promo Banner */}
      <View style={styles.bannerContainer}>
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>NEW COLLECTIONS</Text>
          <View style={styles.bannerDiscountRow}>
            <Text style={styles.bannerDiscount}>20</Text>
            <View>
              <Text style={styles.bannerPercent}>%</Text>
              <Text style={styles.bannerOff}>OFF</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.shopNowButton}>
            <Text style={styles.shopNowText}>SHOP NOW</Text>
          </TouchableOpacity>
        </View>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80",
          }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
      </View>

      {/* Shop By Category - Circular Icons */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Shop By Category</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {/* All Category */}
        <TouchableOpacity
          style={styles.categoryWrapper}
          onPress={() => setSelectedCategory(null)}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.categoryCircle,
              {
                backgroundColor: !selectedCategory ? COLORS.text : "#F1F5F9",
              },
            ]}
          >
            <Icon
              name="Grid"
              size={28}
              color={!selectedCategory ? COLORS.white : COLORS.textSecondary}
            />
          </View>
          <Text
            style={[
              styles.categoryLabel,
              !selectedCategory && styles.categoryLabelActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        {/* Dynamic Categories */}
        {CATEGORIES.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            isSelected={selectedCategory === category.name}
            onPress={() => setSelectedCategory(category.name)}
          />
        ))}
      </ScrollView>

      {/* Curated For You Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Curated For You</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome to</Text>
            <Text style={styles.title}>ShopApp</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome to</Text>
            <Text style={styles.title}>ShopApp</Text>
          </View>
        </View>
        <View style={styles.errorContainer}>
          <Icon name="AlertCircle" size={60} color={COLORS.danger} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadData}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome to</Text>
          <Text style={styles.title}>ShopApp</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="Bell" size={24} color={COLORS.text} />
          <View style={styles.dot} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => handleProductPress(item)}
            onAddToCart={() => handleAddToCart(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="Package" size={60} color={COLORS.border} />
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        }
      />
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.text,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dot: {
    position: "absolute",
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.danger,
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  appHeader: {
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.m,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bannerContainer: {
    marginHorizontal: SPACING.l,
    marginBottom: SPACING.l,
    height: 180,
    backgroundColor: "#E2E8F0", // Slate 200 equivalent
    borderRadius: 0,
    overflow: "hidden",
    flexDirection: "row",
    position: "relative",
  },
  bannerContent: {
    flex: 1,
    padding: SPACING.l,
    justifyContent: "center",
    zIndex: 2,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  bannerDiscountRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: SPACING.m,
  },
  bannerDiscount: {
    fontSize: 48,
    fontWeight: "900",
    color: COLORS.text,
    lineHeight: 48,
  },
  bannerPercent: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 4,
  },
  bannerOff: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },
  shopNowButton: {
    backgroundColor: COLORS.text,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: "flex-start",
    borderRadius: 0, // Sharp edges as per design
  },
  shopNowText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 12,
  },
  bannerImage: {
    width: "55%",
    height: "100%",
    position: "absolute",
    right: 0,
    bottom: 0,
  },
  categoriesContainer: {
    paddingHorizontal: SPACING.l,
    paddingBottom: SPACING.l,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.s,
    color: COLORS.text,
    fontSize: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.l,
    marginBottom: SPACING.m,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  categoryWrapper: {
    alignItems: "center",
    marginRight: SPACING.m,
  },
  categoryCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.xs,
  },
  categoryLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "500",
    textAlign: "center",
  },
  categoryLabelActive: {
    color: COLORS.text,
    fontWeight: "700",
  },
  // Removed old categoryChip styles that are no longer used or were causing conflict
  resultsRow: {
    paddingHorizontal: SPACING.l,
    marginBottom: SPACING.s,
  },
  resultsText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  columnWrapper: {
    paddingHorizontal: SPACING.l,
    justifyContent: "space-between",
  },
  listContent: {
    paddingBottom: SPACING.xl,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    marginBottom: SPACING.m,
    width: "48%",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  imageContainer: {
    height: 140,
    width: "100%",
    backgroundColor: COLORS.white,
    padding: SPACING.s,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badge: {
    position: "absolute",
    top: SPACING.s,
    left: SPACING.s,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: SPACING.s,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.primaryDark,
    textTransform: "capitalize",
  },
  cardContent: {
    padding: SPACING.s,
  },
  row: {
    marginBottom: 2,
  },
  productName: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
  },
  price: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#D97706",
    marginLeft: 2,
  },
  ratingCount: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginLeft: 2,
  },
  addButton: {
    backgroundColor: COLORS.text,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: SPACING.m,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.xl,
  },
  errorText: {
    marginTop: SPACING.m,
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  retryButton: {
    marginTop: SPACING.l,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.xl,
    borderRadius: 28,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.xxl,
  },
  emptyText: {
    marginTop: SPACING.m,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});
