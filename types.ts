export type LanguageCode = 'en' | 'zh';

export interface LocalizedString {
  en: string;
  zh: string;
}

export interface Category {
  id: string;
  parentId: string | null;
  name: LocalizedString;
}

export interface Product {
  id: string;
  categoryId: string;
  name: LocalizedString;
  description: LocalizedString;
  features: LocalizedString;
  price: string;
  imageUrl: string;
  images?: string[];
}

export interface PageContent {
  slug: string; // e.g., 'home', 'about', 'contact'
  title: LocalizedString;
  content: LocalizedString;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

export type UserRole = 'super_admin' | 'admin';

export interface User {
  id: string;
  username: string;
  password?: string; // Only used for verification/setting, not always returned
  role: UserRole;
  createdAt: string;
}