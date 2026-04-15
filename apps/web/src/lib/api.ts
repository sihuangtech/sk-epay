const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

async function request<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export type HealthPayload = {
  name: string;
  status: string;
  timestamp: string;
};

export type MerchantListItem = {
  id: string;
  name: string;
  pid: string;
  status: string;
  allowedPaymentTypes: string[];
  createdAt: string;
};

export type OrderListItem = {
  id: string;
  tradeNo: string;
  merchantTradeNo: string;
  merchantName: string;
  paymentType: string;
  amount: string;
  status: string;
  createdAt: string;
};

export type ChannelListItem = {
  id: string;
  code: string;
  name: string;
  provider: string;
  supportedTypes: string[];
  supportedModes: string[];
  status: string;
  routePriority: number;
  createdAt: string;
};

export async function getHealth() {
  return request<HealthPayload>("/");
}

export async function getMerchants(keyword?: string) {
  const query = keyword ? `?keyword=${encodeURIComponent(keyword)}` : "";
  return request<{ items: MerchantListItem[] }>(`/admin/merchants${query}`);
}

export async function getOrders(keyword?: string) {
  const query = keyword ? `?keyword=${encodeURIComponent(keyword)}` : "";
  return request<{ items: OrderListItem[] }>(`/admin/orders${query}`);
}

export async function getChannels() {
  return request<{ items: ChannelListItem[] }>("/admin/channels");
}
