import { User } from '../types';

const USERS_KEY = 'trivision_users_db';
const SESSION_KEY = 'trivision_session_user';

// Simulating database latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  async register(username: string, password: string): Promise<User> {
    await delay(800); // Fake network delay

    const usersStr = localStorage.getItem(USERS_KEY);
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];

    if (users.find(u => u.username === username)) {
      throw new Error("User ID already exists in the registry.");
    }

    const newUser: User = {
      username,
      password, // Note: storing plain text for demo only. NEVER do this in production.
      createdAt: Date.now()
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Auto login after register
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    return newUser;
  },

  async login(username: string, password: string): Promise<User> {
    await delay(800);

    const usersStr = localStorage.getItem(USERS_KEY);
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      throw new Error("Invalid credentials. Access denied.");
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  async logout(): Promise<void> {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(SESSION_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }
};