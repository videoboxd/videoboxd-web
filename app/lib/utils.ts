import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dueDate(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}
