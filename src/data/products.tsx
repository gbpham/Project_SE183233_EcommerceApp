export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    price: 29.99,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    description: "High-quality sound with noise cancellation technology.",
    category: "Electronics",
  },
  {
    id: "2",
    name: "Ergonomic Office Chair",
    price: 199.5,
    image:
      "https://images.unsplash.com/photo-1592078650553-7c474bb44c87?w=500&q=80",
    description: "Comfortable chair designed for long hours of work.",
    category: "Furniture",
  },
  {
    id: "3",
    name: "Smart Fitness Watch",
    price: 89.99,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    description: "Track your health and fitness goals with precision.",
    category: "Electronics",
  },
  {
    id: "4",
    name: "Modern Coffee Table",
    price: 120.0,
    image:
      "https://images.unsplash.com/photo-1533090481720-856c6e3c1960?w=500&q=80",
    description: "Sleek and stylish coffee table for your living room.",
    category: "Furniture",
  },
  {
    id: "5",
    name: "Professional Camera Kit",
    price: 850.0,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80",
    description: "Everything you need to start professional photography.",
    category: "Electronics",
  },
  {
    id: "6",
    name: "Designer Sunglasses",
    price: 150.0,
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80",
    description: "Protect your eyes with style.",
    category: "Fashion",
  },
];
