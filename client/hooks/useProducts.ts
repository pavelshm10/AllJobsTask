import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types";

const API_URL = "https://localhost:5001/api";

async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/Products`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
}
