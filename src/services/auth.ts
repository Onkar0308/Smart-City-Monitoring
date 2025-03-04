import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '24h';

interface UserResponse {
  id: string;
  email: string;
  displayName?: string;
  userName?: string;
  preferences: {
    notifications: boolean;
  };
  createdAt: Date;
}

const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const convertToUserResponse = (user: IUser): UserResponse => {
  return {
    id: user._id,
    email: user.email,
    displayName: user.displayName,
    userName: user.userName,
    preferences: user.preferences,
    createdAt: user.createdAt
  };
};

export const authService = {
  async signup(email: string, password: string): Promise<{ user: UserResponse; token: string }> {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('Email already registered');
      }

      // Create new user
      const user = new User({
        email,
        password,
        preferences: { notifications: true },
        createdAt: new Date()
      });

      await user.save();
      const token = generateToken(user._id);

      return {
        user: convertToUserResponse(user),
        token
      };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  async login(email: string, password: string): Promise<{ user: UserResponse; token: string }> {
    try {
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new Error('Invalid email or password');
      }

      const token = generateToken(user._id);

      return {
        user: convertToUserResponse(user),
        token
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async getCurrentUser(token: string): Promise<UserResponse | null> {
    try {
      if (!token) return null;

      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      const user = await User.findById(decoded.userId);

      return user ? convertToUserResponse(user) : null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  async updateUser(
    userId: string,
    updates: Partial<Omit<UserResponse, 'id' | 'email' | 'createdAt'>>
  ): Promise<UserResponse> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Update user fields
      if (updates.displayName) user.displayName = updates.displayName;
      if (updates.userName) user.userName = updates.userName;
      if (updates.preferences) user.preferences = updates.preferences;

      await user.save();
      return convertToUserResponse(user);
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  },

  verifyToken(token: string): boolean {
    try {
      jwt.verify(token, JWT_SECRET);
      return true;
    } catch (error) {
      return false;
    }
  }
};