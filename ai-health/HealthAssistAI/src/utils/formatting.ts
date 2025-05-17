// provides formatting utilities for dates and strings
import { format } from 'date-fns';

// formats a date to a readable string
export function formatDate(date: Date | string): string {
  return format(new Date(date), 'PPpp');
}

// capitalizes the first letter of a string
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}
