import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleApiError } from "@/utils/apiErrorHandler";
import { logger } from "@/utils/logger";

interface DeleteProductOptions {
  onSuccess?: (deletedIds: number[]) => void;
  onError?: (error: Error, failedIds: number[]) => void;
}

async function deleteProducts(ids: number[]): Promise<number[]> {
  const deletedIds: number[] = [];
  const isBulk = ids.length > 1;

  logger.info(
    isBulk
      ? `Deleting ${ids.length} products`
      : `Deleting product with ID: ${ids[0]}`,
    { ids }
  );

  // Delete products sequentially to get better error messages
  for (const id of ids) {
    try {
      const endpoint = `https://localhost:5001/api/Products/${id}`;
      const response = await fetch(endpoint, {
        method: "DELETE",
      });

      if (!response.ok) {
        await handleApiError(response, endpoint);
      }

      deletedIds.push(id);
      logger.info(`Successfully deleted product with ID: ${id}`);
    } catch (error) {
      logger.error(`Failed to delete product with ID: ${id}`, error);
      // Stop on first error to show specific error message
      throw error;
    }
  }

  return deletedIds;
}

export function useProductDelete(options?: DeleteProductOptions) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (ids: number | number[]) => {
      // Normalize to array
      const idsArray = Array.isArray(ids) ? ids : [ids];
      return deleteProducts(idsArray);
    },
    onSuccess: (deletedIds) => {
      // Invalidate and refetch products query
      queryClient.invalidateQueries({ queryKey: ["products"] });
      logger.info(
        `Products cache invalidated. Deleted ${deletedIds.length} product(s)`,
        { deletedIds }
      );

      // Call custom success callback if provided
      options?.onSuccess?.(deletedIds);
    },
    onError: (error, variables) => {
      const ids = Array.isArray(variables) ? variables : [variables];
      logger.error("Delete product mutation failed", { error, ids });

      // Call custom error callback if provided
      options?.onError?.(error, ids);
    },
  });

  return {
    // Main mutation function
    deleteProduct: mutation.mutateAsync,

    // Convenience method for single delete
    deleteSingle: (id: number) => mutation.mutateAsync(id),

    // Convenience method for bulk delete
    deleteBulk: (ids: number[]) => mutation.mutateAsync(ids),

    // Mutation state
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,

    // Reset mutation state
    reset: mutation.reset,
  };
}

// Legacy exports for backward compatibility
export const useDeleteProduct = useProductDelete;
export const useDeleteProducts = useProductDelete;
