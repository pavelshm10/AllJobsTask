"use client";

import { useEffect } from "react";
import { Product } from "@/types";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";
import ProductsTableHeader from "./ProductsTableHeader";
import ProductsTableBody from "./ProductsTableBody";
import ProductsTableModals from "./ProductsTableModals";
import ProductsTableStates from "./ProductsTableStates";
import { useProductSearch } from "@/hooks/useProductSearch";
import { useProductSelection } from "@/hooks/useProductSelection";
import { usePagination } from "@/hooks/usePagination";
import { useProductDeleteOperations } from "@/hooks/useProductDeleteOperations";
import { exportProductsToCSV } from "@/utils/csvExport";
import { useToast } from "@/context/ToastContext";

interface ProductsTableProps {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export default function ProductsTable({
  products,
  loading,
  error,
}: ProductsTableProps) {
  const { showError } = useToast();

  const {
    filteredProducts,
    searchQuery,
    showAutocomplete,
    autocompleteSuggestions,
    handleSearchChange,
    handleSuggestionClick,
    clearSearch,
  } = useProductSearch(products);

  const {
    selectedProducts,
    handleSelectProduct,
    handleSelectAll,
    clearSelection,
    isAllSelected,
  } = useProductSelection();

  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedProducts,
    handlePageChange,
    handlePageSizeChange,
  } = usePagination(filteredProducts);

  const {
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
  } = useProductDeleteOperations();

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      showError(`Failed to load products: ${error}`);
    }
  }, [error, showError]);

  // Handler functions
  const handleSelectAllForPage = () => {
    handleSelectAll(paginatedProducts);
  };

  const handleConfirmBulkDeleteWithClear = () => {
    handleConfirmBulkDelete(selectedProducts, clearSelection);
  };

  const handleExportToCSV = () => {
    const productsToExport =
      searchQuery.trim() !== "" ? filteredProducts : products;
    exportProductsToCSV(productsToExport, "products_export");
    // Note: Success message will be handled by the modals component
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  };

  const handleCancelBulkDelete = () => {
    setShowBulkDeleteConfirm(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 transition-colors duration-300">
      <ProductsTableModals
        showDeleteConfirm={showDeleteConfirm}
        showBulkDeleteConfirm={showBulkDeleteConfirm}
        productToDelete={productToDelete}
        selectedCount={selectedProducts.size}
        deleteSuccess={deleteSuccess}
        deleteError={deleteError}
        onConfirmDelete={handleConfirmDelete}
        onConfirmBulkDelete={handleConfirmBulkDeleteWithClear}
        onDismissError={dismissError}
        onDismissSuccess={dismissSuccess}
        onCancelDelete={handleCancelDelete}
        onCancelBulkDelete={handleCancelBulkDelete}
      />

      <ProductsTableHeader
        selectedCount={selectedProducts.size}
        totalProducts={products.length}
        onBulkDelete={handleBulkDeleteClick}
        onExportToCSV={handleExportToCSV}
      />

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onClear={clearSearch}
        suggestions={autocompleteSuggestions}
        showSuggestions={showAutocomplete}
        onSuggestionClick={handleSuggestionClick}
        resultCount={filteredProducts.length}
      />

      <ProductsTableStates
        loading={loading}
        error={error}
        products={products}
        filteredProducts={filteredProducts}
        searchQuery={searchQuery}
        onClearSearch={clearSearch}
      />

      {!loading && !error && filteredProducts.length > 0 && (
        <>
          <ProductsTableBody
            products={paginatedProducts}
            selectedProducts={selectedProducts}
            onSelectProduct={handleSelectProduct}
            onSelectAll={handleSelectAllForPage}
            onDeleteClick={handleDeleteClick}
            isAllSelected={isAllSelected(paginatedProducts)}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              pageSize={10}
              totalItems={filteredProducts.length}
              onPageSizeChange={handlePageSizeChange}
              itemLabel="products"
            />
          )}
        </>
      )}
    </div>
  );
}
