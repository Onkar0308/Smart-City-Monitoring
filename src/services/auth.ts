interface UserPreferences {
  notifications: boolean;
}

interface User {
  id: string;
  email: string;
  displayName?: string;
  userName?: string;
  preferences: UserPreferences;
  createdAt: Date;
}

interface DbUser {
  id: string;
  email: string;
  password: string;
  displayName?: string;
  userName?: string;
  preferences: UserPreferences;
  createdAt: Date;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  notifications: true
};

// Simulated database
let users: DbUser[] = [];

// Helper function to hash password (in a real app, use bcrypt or similar)
const hashPassword = (password: string): string => {
  return btoa(password); // Base64 encoding for demo - use proper hashing in production
};

// Helper function to verify password
const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

export const authService = {
  async signup(email: string, password: string): Promise<User> {
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user
    const newUser: DbUser = {
      id: crypto.randomUUID(),
      email,
      password: hashPassword(password),
      preferences: DEFAULT_PREFERENCES,
      createdAt: new Date()
    };

    users.push(newUser);

    // Return user without password
    const { password: _, ...user } = newUser;
    return user;
  },

  async login(email: string, password: string): Promise<User> {
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    if (!verifyPassword(password, user.password)) {
      throw new Error('Invalid email or password');
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async getCurrentUser(): Promise<User | null> {
    const userJson = localStorage.getItem('currentUser');
    if (!userJson) return null;
    return JSON.parse(userJson);
  },

  async updateUser(userId: string, updates: Partial<Omit<User, 'id' | 'email' | 'createdAt'>>): Promise<User> {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const user = users[userIndex];
    const updatedUser: DbUser = {
      ...user,
      ...updates,
      preferences: {
        ...user.preferences,
        ...(updates.preferences || {})
      }
    };

    users[userIndex] = updatedUser;
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('currentUser');
  }
};