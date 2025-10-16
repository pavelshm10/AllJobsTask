import { useState } from "react";
import { Product } from "@/types";

export function useProductSelection() {
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(
    new Set()
  );

  const handleSelectProduct = (productId: number) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const handleSelectAll = (paginatedProducts: Product[]) => {
    if (selectedProducts.size === paginatedProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(paginatedProducts.map((p) => p.id)));
    }
  };

  const clearSelection = () => {
    setSelectedProducts(new Set());
  };

  const isAllSelected = (paginatedProducts: Product[]) => {
    return (
      selectedProducts.size === paginatedProducts.length &&
      paginatedProducts.length > 0
    );
  };

  const isProductSelected = (productId: number) => {
    return selectedProducts.has(productId);
  };

  return {
    selectedProducts,
    handleSelectProduct,
    handleSelectAll,
    clearSelection,
    isAllSelected,
    isProductSelected,
  };
}
