import { useState, useEffect } from "react";
import { Product } from "@/types";

export function useProductSearch(products: Product[]) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<
    string[]
  >([]);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredProducts(products);
      setShowAutocomplete(false);
      return;
    }

    // Filter products by name or category
    const filtered = products.filter(
      (product) =>
        product.productName.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredProducts(filtered);

    // Generate autocomplete suggestions (unique product names and categories)
    const suggestions = new Set<string>();
    products.forEach((product) => {
      if (product.productName.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(product.productName);
      }
      if (product.category.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(product.category);
      }
    });

    setAutocompleteSuggestions(Array.from(suggestions).slice(0, 8));
    setShowAutocomplete(suggestions.size > 0);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    const filtered = products.filter(
      (product) =>
        product.productName.toLowerCase().includes(suggestion.toLowerCase()) ||
        product.category.toLowerCase().includes(suggestion.toLowerCase())
    );
    setFilteredProducts(filtered);
    setShowAutocomplete(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredProducts(products);
    setShowAutocomplete(false);
  };

  return {
    filteredProducts,
    searchQuery,
    showAutocomplete,
    autocompleteSuggestions,
    handleSearchChange,
    handleSuggestionClick,
    clearSearch,
  };
}
