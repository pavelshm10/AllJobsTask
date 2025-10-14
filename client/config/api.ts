/**
 * API Configuration
 * Centralized configuration for API endpoints
 */

// Get API base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:5001";

// Validate API URL
if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL environment variable is not defined");
}

/**
 * API Endpoints Configuration
 */
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  
  // Endpoint paths
  ENDPOINTS: {
    WEATHER_FORECAST: "/api/WeatherForecast",
    PRODUCTS: "/api/Products",
    CUSTOMERS: "/api/Customers",
    TOP_CUSTOMERS: "/api/Customers/top",
  },
  
  // Build full URL for an endpoint
  getUrl: (endpoint: string) => `${API_BASE_URL}${endpoint}`,
  
  // Build product-specific URLs
  getProductUrl: (id?: number) => 
    id ? `${API_BASE_URL}/api/Products/${id}` : `${API_BASE_URL}/api/Products`,
  
  // Build customer-specific URLs
  getCustomerUrl: (id?: number) => 
    id ? `${API_BASE_URL}/api/Customers/${id}` : `${API_BASE_URL}/api/Customers`,
  
  getTopCustomersUrl: (limit: number) => 
    `${API_BASE_URL}/api/Customers/top/${limit}`,
};

// Export base URL for convenience
export const API_URL = API_BASE_URL;

export default API_CONFIG;

