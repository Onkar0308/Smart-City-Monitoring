import bcrypt from 'bcryptjs';
import { db } from '../lib/db';
import { emailService } from './email';

interface UserPreferences {
  notifications: boolean;
}

interface User {
  _id: string;
  email: string;
  displayName?: string;
  userName?: string;
  preferences: UserPreferences;
  createdAt: Date;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  notifications: true
};

const SALT_ROUNDS = 10;

export const authService = {
  async signup(email: string, password: string): Promise<User> {
    // Check if user already exists
    const existingUser = await db.findUser(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create new user
    const newUser = await db.createUser({
      email,
      password: hashedPassword,
      preferences: DEFAULT_PREFERENCES,
      createdAt: new Date()
    });

    // Send welcome email
    await emailService.sendWelcomeEmail(email);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  async login(email: string, password: string): Promise<User> {
    // Find user
    const user = await db.findUser(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
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

  async updateUser(userId: string, updates: Partial<Omit<User, '_id' | 'email' | 'createdAt'>>): Promise<User> {
    const updatedUser = await db.updateUser(userId, updates);
    if (!updatedUser) {
      throw new Error('User not found');
    }

    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('currentUser');
  }
};