import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Product } from "@/types";

const API_URL = "https://localhost:5001/api";

interface CreateProductData {
  productName: string;
  category: string;
  supplier: string;
  unitPrice: number;
  units: number;
}

async function createProduct(productData: CreateProductData): Promise<Product> {
  const response = await fetch(`${API_URL}/Products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to create product");
  }

  return response.json();
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      // Invalidate products query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
