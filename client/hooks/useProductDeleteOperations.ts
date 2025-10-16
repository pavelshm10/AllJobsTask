import { useState } from "react";
import { Product } from "@/types";
import { useProductDelete } from "./useProductDelete";
import { getUserFriendlyMessage } from "@/utils/apiErrorHandler";

export function useProductDeleteOperations() {
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  const { deleteSingle, deleteBulk } = useProductDelete();

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };

  const handleBulkDeleteClick = () => {
    setShowBulkDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      setDeleteError(null);
      await deleteSingle(productToDelete.id);
      setDeleteSuccess(
        `Product "${productToDelete.productName}" deleted successfully!`
      );
      setShowDeleteConfirm(false);
      setProductToDelete(null);
      setTimeout(() => setDeleteSuccess(null), 5000);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? getUserFriendlyMessage(error)
          : "Failed to delete product";
      setDeleteError(errorMessage);
      setShowDeleteConfirm(false);
      setProductToDelete(null);
    }
  };

  const handleConfirmBulkDelete = async (
    selectedProducts: Set<number>,
    clearSelection: () => void
  ) => {
    try {
      setDeleteError(null);
      await deleteBulk(Array.from(selectedProducts));
      setDeleteSuccess(
        `${selectedProducts.size} product(s) deleted successfully!`
      );
      setShowBulkDeleteConfirm(false);
      clearSelection();
      setTimeout(() => setDeleteSuccess(null), 5000);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? getUserFriendlyMessage(error)
          : "Failed to delete products";
      setDeleteError(errorMessage);
      setShowBulkDeleteConfirm(false);
    }
  };

  const dismissError = () => setDeleteError(null);
  const dismissSuccess = () => setDeleteSuccess(null);

  return {
    productToDelete,
    showDeleteConfirm,
    showBulkDeleteConfirm,
    deleteError,
    deleteSuccess,
    handleDeleteClick,
    handleBulkDeleteClick,
    handleConfirmDelete,
    handleConfirmBulkDelete,
    dismissError,
    dismissSuccess,
    setShowDeleteConfirm,
    setShowBulkDeleteConfirm,
    setProductToDelete,
  };
}
