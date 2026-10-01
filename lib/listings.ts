export type PublicListing = {
  id: string;
  title: string;
  description: string;
  room_type: string;
  rent_amount_pesewas: number;
  rent_period: string;
  town: string;
  area: string;
  facilities: string[];
  last_confirmed_at: string | null;
  photo_paths: string[];
};

export function moneyFromPesewas(amount: number): string {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 2,
  }).format(amount / 100);
}

export function availabilityLabel(lastConfirmedAt: string | null, now = Date.now()): string {
  if (!lastConfirmedAt) return "Needs confirmation";
  const confirmedAt = Date.parse(lastConfirmedAt);
  if (!Number.isFinite(confirmedAt)) return "Needs confirmation";
  const days = Math.max(0, Math.floor((now - confirmedAt) / 86_400_000));
  if (days === 0) return "Confirmed today";
  if (days <= 20) return `Confirmed ${days} day${days === 1 ? "" : "s"} ago`;
  return "Needs confirmation";
}
