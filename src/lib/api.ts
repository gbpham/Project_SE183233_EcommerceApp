// API service for FakeStoreAPI
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "https://fakestoreapi.com";

export interface ApiProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  name: {
    firstname: string;
    lastname: string;
  };
  address: {
    city: string;
    street: string;
    number: number;
    zipcode: string;
  };
  phone: string;
}

// Fetch all products
export async function fetchProducts(): Promise<ApiProduct[]> {
  const response = await fetch(`${BASE_URL}/products`);
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
}

// Fetch single product by ID
export async function fetchProductById(id: number): Promise<ApiProduct> {
  const response = await fetch(`${BASE_URL}/products/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }
  return response.json();
}

// Fetch all categories
export async function fetchCategories(): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/products/categories`);
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
}

// Fetch products by category
export async function fetchProductsByCategory(
  category: string,
): Promise<ApiProduct[]> {
  const response = await fetch(`${BASE_URL}/products/category/${category}`);
  if (!response.ok) {
    throw new Error("Failed to fetch products by category");
  }
  return response.json();
}

// Login user
export async function loginUser(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    throw new Error("Invalid credentials");
  }
  return response.json();
}

// Fetch user by ID
export async function fetchUserById(id: number): Promise<User> {
  const response = await fetch(`${BASE_URL}/users/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return response.json();
}
