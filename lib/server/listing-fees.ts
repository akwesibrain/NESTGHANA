import "server-only";
import type { ListingFeeType, PropertyCategory, RoomType } from "@/generated/prisma/client";
import { getDb } from "./db";

// Server-authoritative listing fees by type. Mirrors listing-pricing.js (getListingType): student
// hostels pay the hostel fee, commercial listings the space fee, every other room the room fee.

export function listingFeeType(category: PropertyCategory, roomType: RoomType): ListingFeeType {
  if (category === "COMMERCIAL") return "SPACE";
  return roomType === "STUDENT_HOSTEL" ? "HOSTEL" : "ROOM";
}

export type ListingFees = { room: number; hostel: number; space: number; currency: string };

export async function getListingFees(): Promise<ListingFees> {
  const settings = await getDb().websiteSettings.findUniqueOrThrow({
    where: { id: 1 },
    select: { roomFeePesewas: true, hostelFeePesewas: true, spaceFeePesewas: true, currency: true },
  });
  return {
    room: settings.roomFeePesewas,
    hostel: settings.hostelFeePesewas,
    space: settings.spaceFeePesewas,
    currency: settings.currency,
  };
}

export function feeFor(fees: ListingFees, type: ListingFeeType): number {
  return type === "SPACE" ? fees.space : type === "HOSTEL" ? fees.hostel : fees.room;
}
