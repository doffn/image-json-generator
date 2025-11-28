import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return crypto
    .getRandomValues(new Uint8Array(16))
    .reduce((acc, byte) => {
      return acc + byte.toString(16).padStart(2, "0")
    }, "")
    .replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5")
}
