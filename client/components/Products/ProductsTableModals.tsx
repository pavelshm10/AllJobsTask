"use client";

import ConfirmDialog from "../UI/ConfirmDialog";
import ErrorBanner from "../UI/ErrorBanner";
import SuccessBanner from "../UI/SuccessBanner";
import { Product } from "@/types";

interface ProductsTableModalsProps {
  // Delete confirmation states
  showDeleteConfirm: boolean;
  showBulkDeleteConfirm: boolean;
  productToDelete: Product | null;
  selectedCount: number;

  // Success/Error states
  deleteSuccess: string | null;
  deleteError: string | null;

  // Handlers
  onConfirmDelete: () => void;
  onConfirmBulkDelete: () => void;
  onDismissError: () => void;
  onDismissSuccess: () => void;
  onCancelDelete: () => void;
  onCancelBulkDelete: () => void;
}

export default function ProductsTableModals({
  showDeleteConfirm,
  showBulkDeleteConfirm,
  productToDelete,
  selectedCount,
  deleteSuccess,
  deleteError,
  onConfirmDelete,
  onConfirmBulkDelete,
  onDismissError,
  onDismissSuccess,
  onCancelDelete,
  onCancelBulkDelete,
}: ProductsTableModalsProps) {
  return (
    <>
      {/* Success Banner */}
      {deleteSuccess && (
        <SuccessBanner message={deleteSuccess} onDismiss={onDismissSuccess} />
      )}

      {/* Error Banner */}
      {deleteError && (
        <ErrorBanner message={deleteError} onDismiss={onDismissError} />
      )}

      {/* Single Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={showDeleteConfirm && productToDelete !== null}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.productName}"? This action cannot be undone.`}
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="red"
      />

      {/* Bulk Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={showBulkDeleteConfirm}
        title="Delete Multiple Products"
        message={`Are you sure you want to delete ${selectedCount} product(s)? This action cannot be undone.`}
        onConfirm={onConfirmBulkDelete}
        onCancel={onCancelBulkDelete}
        confirmText={`Delete ${selectedCount} item(s)`}
        cancelText="Cancel"
        confirmColor="red"
      />
    </>
  );
}
