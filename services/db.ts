import { Category, Product, PageContent, ContactMessage, LocalizedString, User } from '../types';

// Initial Seed Data
const INITIAL_CATEGORIES: Category[] = [
  { id: 'c1', parentId: null, name: { en: 'Electronics', zh: '电子产品' } },
  { id: 'c2', parentId: null, name: { en: 'Services', zh: '企业服务' } },
  { id: 'c3', parentId: 'c1', name: { en: 'Computers', zh: '计算机' } },
  { id: 'c4', parentId: 'c1', name: { en: 'Smartphones', zh: '智能手机' } },
  { id: 'c5', parentId: 'c2', name: { en: 'Consulting', zh: '咨询服务' } },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    categoryId: 'c3',
    name: { en: 'Pro Workstation X1', zh: '专业工作站 X1' },
    description: { en: 'High-performance computing for professionals.', zh: '专为专业人士设计的高性能计算设备。' },
    features: { en: '32-core CPU, 128GB RAM', zh: '32核处理器, 128GB 内存' },
    price: '$2,999',
    imageUrl: 'https://picsum.photos/seed/tech1/400/300',
    images: [
      'https://picsum.photos/seed/tech1/800/600',
      'https://picsum.photos/seed/tech1_angle/800/600',
      'https://picsum.photos/seed/tech1_detail/800/600',
      'https://picsum.photos/seed/tech1_setup/800/600'
    ]
  },
  {
    id: 'p2',
    categoryId: 'c4',
    name: { en: 'Galaxy Phone Ultra', zh: '银河手机 Ultra' },
    description: { en: 'The future in your hands.', zh: '未来尽在掌握。' },
    features: { en: '5G, AI Camera', zh: '5G网络, AI相机' },
    price: '$999',
    imageUrl: 'https://picsum.photos/seed/phone1/400/300',
    images: [
      'https://picsum.photos/seed/phone1/800/600',
      'https://picsum.photos/seed/phone1_back/800/600',
      'https://picsum.photos/seed/phone1_screen/800/600'
    ]
  },
  {
    id: 'p3',
    categoryId: 'c5',
    name: { en: 'IT Audit Service', zh: 'IT 审计服务' },
    description: { en: 'Comprehensive security analysis.', zh: '全面的安全分析服务。' },
    features: { en: 'ISO 27001 compliant', zh: '符合 ISO 27001 标准' },
    price: 'Contact Us',
    imageUrl: 'https://picsum.photos/seed/service1/400/300'
  }
];

const INITIAL_PAGES: PageContent[] = [
  {
    slug: 'home',
    title: { en: 'Welcome to FutureCorp', zh: '欢迎来到未来科技' },
    content: { 
      en: 'We build the technology of tomorrow, today. Explore our innovative solutions designed to empower your business.', 
      zh: '我们今天就在创造明日科技。探索我们要为您的业务赋能的创新解决方案。' 
    }
  },
  {
    slug: 'about',
    title: { en: 'About Us', zh: '关于我们' },
    content: { 
      en: 'Founded in 2024, FutureCorp is a global leader in innovation. Our mission is to simplify complexity through technology.', 
      zh: '未来科技成立于2024年，是全球创新的领导者。我们的使命是通过技术简化复杂性。' 
    }
  },
  {
    slug: 'contact',
    title: { en: 'Contact Us', zh: '联系我们' },
    content: { 
      en: '123 Tech Avenue, Silicon Valley, CA. Phone: +1 (555) 123-4567', 
      zh: '加利福尼亚州硅谷科技大道123号。电话：+1 (555) 123-4567' 
    }
  }
];

const INITIAL_USERS: User[] = [
  {
    id: 'u1',
    username: 'admin',
    password: 'password123', // In a real app, this would be hashed
    role: 'super_admin',
    createdAt: new Date().toISOString()
  }
];

// Helper to simulate DB delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

class MockDB {
  private load<T>(key: string, initial: T): T {
    const stored = localStorage.getItem(key);
    if (!stored) {
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(stored);
  }

  private save<T>(key: string, data: T) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // --- Categories ---
  async getCategories(): Promise<Category[]> {
    await delay(100);
    return this.load('categories', INITIAL_CATEGORIES);
  }

  async saveCategory(category: Category): Promise<void> {
    await delay(100);
    const list = await this.getCategories();
    const index = list.findIndex(c => c.id === category.id);
    if (index >= 0) {
      list[index] = category;
    } else {
      list.push(category);
    }
    this.save('categories', list);
  }

  async deleteCategory(id: string): Promise<void> {
    const list = await this.getCategories();
    this.save('categories', list.filter(c => c.id !== id));
  }

  // --- Products ---
  async getProducts(): Promise<Product[]> {
    await delay(100);
    return this.load('products', INITIAL_PRODUCTS);
  }

  async saveProduct(product: Product): Promise<void> {
    await delay(100);
    const list = await this.getProducts();
    const index = list.findIndex(p => p.id === product.id);
    if (index >= 0) {
      list[index] = product;
    } else {
      list.push(product);
    }
    this.save('products', list);
  }

  async deleteProduct(id: string): Promise<void> {
    const list = await this.getProducts();
    this.save('products', list.filter(p => p.id !== id));
  }

  // --- Pages ---
  async getPage(slug: string): Promise<PageContent | undefined> {
    await delay(50);
    const pages = this.load('pages', INITIAL_PAGES);
    return pages.find(p => p.slug === slug);
  }

  async savePage(page: PageContent): Promise<void> {
    await delay(100);
    const list = this.load('pages', INITIAL_PAGES);
    const index = list.findIndex(p => p.slug === page.slug);
    if (index >= 0) {
      list[index] = page;
    } else {
      list.push(page);
    }
    this.save('pages', list);
  }

  // --- Contact Messages ---
  async sendMessage(msg: Omit<ContactMessage, 'id' | 'date'>): Promise<void> {
    await delay(300);
    const list = this.load<ContactMessage[]>('messages', []);
    const newMsg: ContactMessage = {
      ...msg,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString()
    };
    list.push(newMsg);
    this.save('messages', list);
  }

  // --- Users (Auth) ---
  async getUsers(): Promise<User[]> {
    await delay(100);
    return this.load('users', INITIAL_USERS);
  }

  async getUser(username: string): Promise<User | undefined> {
    const users = await this.getUsers();
    return users.find(u => u.username === username);
  }

  async saveUser(user: User): Promise<void> {
    await delay(100);
    const list = await this.getUsers();
    const index = list.findIndex(u => u.id === user.id);
    if (index >= 0) {
      // If updating, keep password if not provided in update
      const existing = list[index];
      list[index] = { ...user, password: user.password || existing.password };
    } else {
      list.push(user);
    }
    this.save('users', list);
  }

  async deleteUser(id: string): Promise<void> {
    await delay(100);
    const list = await this.getUsers();
    this.save('users', list.filter(u => u.id !== id));
  }
}

export const db = new MockDB();