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
import { fetchProducts, ApiProduct } from "../lib/api";
import { RootStackParamList } from "../navigation/AppNavigator";
import { CATEGORIES } from "../data/categories";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "MainTabs">;

const FILTER_OPTIONS = [
  { id: "filter", label: "Filter", icon: "SlidersHorizontal" },
  { id: "ratings", label: "Ratings", icon: "Star" },
  { id: "size", label: "Size", icon: "Ruler" },
  { id: "color", label: "Color", icon: "Palette" },
  { id: "price", label: "Price", icon: "DollarSign" },
];

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
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={(e) => e.stopPropagation()}
      >
        <Icon name="Heart" size={18} color={COLORS.textSecondary} />
      </TouchableOpacity>
    </View>
    <View style={styles.cardContent}>
      <View style={styles.brandRow}>
        <Text style={styles.brandText}>H&M</Text>
        <View style={styles.ratingBadge}>
          <Icon name="Star" size={12} color="#F59E0B" />
          <Text style={styles.ratingText}>{product.rating.rate}</Text>
          <Text style={styles.ratingCount}>({product.rating.count})</Text>
        </View>
      </View>
      <Text style={styles.productName} numberOfLines={1}>
        {product.title}
      </Text>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>
    </View>
  </TouchableOpacity>
);

export default function ExploreScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const productsData = await fetchProducts();
      setProducts(productsData);
    } catch (err) {
      setError("Failed to load products. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query),
      );
    }

    return result;
  }, [products, selectedCategory, searchQuery]);

  const handleProductPress = (product: ApiProduct) => {
    navigation.navigate("ProductDetail", { product });
  };

  const handleAddToCart = (product: ApiProduct) => {
    addToCart(product);
  };

  const renderHeader = () => (
    <View>
      {/* Category Grid */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {CATEGORIES.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            isSelected={selectedCategory === category.name}
            onPress={() =>
              setSelectedCategory(
                selectedCategory === category.name ? null : category.name,
              )
            }
            size="small"
          />
        ))}
      </ScrollView>

      {/* Results Info */}
      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>
          {filteredProducts.length} items found
        </Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
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

      {/* Header with Search and Back */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="ArrowLeft" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Icon name="Search" size={18} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder={
              selectedCategory
                ? `Search in ${selectedCategory}...`
                : "Search products..."
            }
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Icon name="X" size={16} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        {FILTER_OPTIONS.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={styles.filterChip}
            onPress={() => {
              // Future: Implement actual filtering logic
              // For now, toggle visual feedback or show alert
              console.log(`Filter pressed: ${filter.label}`);
            }}
            activeOpacity={0.6}
          >
            <Icon
              name={filter.icon as any}
              size={14}
              color={COLORS.textSecondary}
            />
            <Text style={styles.filterChipText}>{filter.label}</Text>
            <Icon name="ChevronDown" size={14} color={COLORS.textSecondary} />
          </TouchableOpacity>
        ))}
      </ScrollView>

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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    gap: SPACING.s,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.m,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.s,
    color: COLORS.text,
    fontSize: 14,
  },
  filterContainer: {
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    gap: SPACING.s,
    height: 60, // Ensure container has enough height
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.m,
    height: 40, // Fixed height to prevent clipping
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.s,
    gap: 6,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.text,
  },
  categoriesContainer: {
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.m,
  },
  resultsRow: {
    paddingHorizontal: SPACING.m,
    marginBottom: SPACING.s,
  },
  resultsText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  columnWrapper: {
    paddingHorizontal: SPACING.m,
    justifyContent: "space-between",
  },
  listContent: {
    paddingBottom: SPACING.xl,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
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
    height: 160,
    width: "100%",
    backgroundColor: COLORS.white,
    padding: SPACING.s,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  favoriteButton: {
    position: "absolute",
    top: SPACING.s,
    right: SPACING.s,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    padding: SPACING.s,
  },
  brandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  brandText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#D97706",
    marginLeft: 2,
  },
  ratingCount: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  productName: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
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
