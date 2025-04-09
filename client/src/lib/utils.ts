import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount / 100);
}

export function formatDate(date: string | Date): string {
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  return format(parsedDate, "MMMM d, yyyy");
}

export function formatDateTime(date: string | Date): string {
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  return format(parsedDate, "MMMM d, yyyy h:mm a");
}

export function formatRelativeTime(date: string | Date): string {
  const parsedDate = typeof date === "string" ? parseISO(date) : date;
  return formatDistanceToNow(parsedDate, { addSuffix: true });
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function generateTimeSlots(
  startHour: number = 9,
  endHour: number = 17,
  intervalMinutes: number = 60
): string[] {
  const slots: string[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      const isPM = hour >= 12;
      const formattedHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const formattedMinute = minute.toString().padStart(2, "0");
      const period = isPM ? "PM" : "AM";
      slots.push(`${formattedHour}:${formattedMinute} ${period}`);
    }
  }
  return slots;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
