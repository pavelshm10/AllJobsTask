import { useQuery } from "@tanstack/react-query";
import { CustomerOrderSummary } from "@/types";

const API_URL = "https://localhost:5001/api";

async function fetchTopCustomers(
  count: number = 3
): Promise<CustomerOrderSummary[]> {
  const response = await fetch(`${API_URL}/Customers/top?count=${count}`);

  if (!response.ok) {
    throw new Error("Failed to fetch customer data");
  }

  return response.json();
}

export function useTopCustomers(count: number = 3) {
  return useQuery({
    queryKey: ["topCustomers", count],
    queryFn: () => fetchTopCustomers(count),
  });
}
