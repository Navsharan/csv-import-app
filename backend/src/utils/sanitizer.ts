import { escape } from 'validator';

export const sanitizeString = (value: string | null | undefined): string => {
  if (!value) return '';
  const cleanValue = value.trim()
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, ' ');
  return escape(cleanValue);
};

export const sanitizeArray = (arr: any[]): any[] => {
  return arr.map(item => {
    if (typeof item === 'string') {
      return sanitizeString(item);
    }
    if (typeof item === 'object' && item !== null) {
      return sanitizeObject(item);
    }
    return item;
  });
};

export const sanitizeObject = (obj: any): any => {
  const sanitized: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = sanitizeArray(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};