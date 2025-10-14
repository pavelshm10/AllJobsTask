import { Product } from "@/types";

/**
 * Converts a value to CSV-safe string
 * Handles escaping quotes and commas
 */
function sanitizeValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);

  // If value contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

export function exportProductsToCSV(
  products: Product[],
  filename: string = "products",
  includeHeaders: boolean = true
): void {
  if (products.length === 0) {
    return;
  }

  // Define CSV columns
  const columns = [
    { key: "id", header: "ID" },
    { key: "productName", header: "Product Name" },
    { key: "category", header: "Category" },
    { key: "supplier", header: "Supplier" },
    { key: "quantityPerUnit", header: "Quantity Per Unit" },
    { key: "unitPrice", header: "Unit Price" },
    { key: "units", header: "Units in Stock" },
    { key: "createdAt", header: "Created At" },
    { key: "updatedAt", header: "Updated At" },
  ];

  // Build CSV content
  const csvRows: string[] = [];

  // Add headers
  if (includeHeaders) {
    const headerRow = columns.map((col) => sanitizeValue(col.header)).join(",");
    csvRows.push(headerRow);
  }

  // Add data rows
  products.forEach((product) => {
    const row = columns
      .map((col) => {
        const value = product[col.key as keyof Product];

        // Format dates
        if (col.key === "createdAt" || col.key === "updatedAt") {
          if (value) {
            const date = new Date(value as string);
            return sanitizeValue(date.toLocaleString());
          }
          return "";
        }

        // Format currency
        if (col.key === "unitPrice") {
          return sanitizeValue((value as number).toFixed(2));
        }

        return sanitizeValue(value as string | number);
      })
      .join(",");

    csvRows.push(row);
  });

  // Create CSV string
  const csvContent = csvRows.join("\n");

  // Create Blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    // Create download link
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${timestamp}.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

      // Clean up
      URL.revokeObjectURL(url);
    }
}
