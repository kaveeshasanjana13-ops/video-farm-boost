import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Masks the last 4 digits of a registration number or ID
 * @param value - The value to mask (e.g., "STU123456", "ABC987654321")
 * @returns Masked string (e.g., "STU12****", "ABC98765****")
 */
export function maskRegistrationNumber(value: string): string {
  if (!value || value.length <= 4) return value;
  const visiblePart = value.slice(0, -4);
  return `${visiblePart}****`;
}
