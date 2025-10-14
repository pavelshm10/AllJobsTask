import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Product } from "@/types";

const API_URL = "https://localhost:5001/api";

interface UpdateProductData {
  productName: string;
  category: string;
  supplier: string;
  unitPrice: number;
  units: number;
}

async function updateProduct(
  id: number,
  productData: UpdateProductData
): Promise<Product> {
  const response = await fetch(`${API_URL}/Products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to update product");
  }

  return response.json();
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductData }) =>
      updateProduct(id, data),
    onSuccess: () => {
      // Invalidate products query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
