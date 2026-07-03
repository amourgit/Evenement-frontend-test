import { clsx, type ClassValue } from "clsx";

/** Fusionne conditionnellement des classes Tailwind */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
