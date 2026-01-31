// Category data with icons for circular display
// Using Lucide icon names that map to FakeStoreAPI categories

export interface CategoryData {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  color: string;
  backgroundColor: string;
}

export const CATEGORIES: CategoryData[] = [
  {
    id: "electronics",
    name: "electronics",
    displayName: "Electronics",
    icon: "Smartphone",
    color: "#3B82F6",
    backgroundColor: "#EFF6FF",
  },
  {
    id: "jewelery",
    name: "jewelery",
    displayName: "Jewelry",
    icon: "Gem",
    color: "#EC4899",
    backgroundColor: "#FDF2F8",
  },
  {
    id: "mens-clothing",
    name: "men's clothing",
    displayName: "Men",
    icon: "Shirt",
    color: "#6366F1",
    backgroundColor: "#EEF2FF",
  },
  {
    id: "womens-clothing",
    name: "women's clothing",
    displayName: "Women",
    icon: "ShoppingBag",
    color: "#F59E0B",
    backgroundColor: "#FFFBEB",
  },
];

export const getCategoryByName = (name: string): CategoryData | undefined => {
  return CATEGORIES.find((cat) => cat.name === name);
};
